from contextlib import redirect_stdout
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import URLError
from notify import Page, changed_urls, main


def digest(html, url='https://example.org/docs'):
    page = Page(url)
    page.feed(html)
    return page.fingerprint()


class IndexNowTests(unittest.TestCase):
    def test_deployment_noise_does_not_resubmit_content(self):
        first = '<head><title>Docs</title></head><body><nav>Old menu</nav><main id="a">Hello <script>build1</script><style>.a{}</style> world</main></body>'
        second = '<head><title>Docs</title></head><body><nav>New menu</nav><main id="b">Hello<script>build2</script><style>.b{}</style>  world</main></body>'
        self.assertEqual(digest(first), digest(second))

    def test_text_metadata_and_link_changes_are_detected(self):
        base = '<head><title>Docs</title><meta name="description" content="Guide"></head><body><main><a href="/one">Read</a></main></body>'
        for before, after in [('Read', 'Learn'), ('Guide', 'New guide'), ('/one', '/two'), ('Docs', 'Docs v2')]:
            self.assertNotEqual(digest(base), digest(base.replace(before, after)))

    def test_nonindexable_pages_are_excluded(self):
        body = '<body><main>Guide</main></body>'
        self.assertIsNone(digest('<meta name="robots" content="noindex, follow">' + body))
        self.assertIsNone(digest('<link rel="canonical" href="/other">' + body))
        self.assertIsNotNone(digest('<link rel="canonical" href="/docs/">' + body))

    def test_body_fallback_and_empty_challenge(self):
        self.assertIsNotNone(digest('<body><h1>Hello</h1><p>World</p></body>'))
        with self.assertRaises(ValueError):
            digest('<body><script>challenge()</script></body>')

    def test_initial_baseline_only_submits_selected_pages(self):
        self.assertEqual(changed_urls(None, {'/': 'a', '/old': 'b'}, ['/']), ['/'])
        self.assertEqual(changed_urls(None, {'https://example.org': 'a'}, ['https://example.org/']), ['https://example.org'])

    def test_article_callouts_are_content(self):
        first = '<body><main><aside>Warning one</aside></main></body>'
        self.assertNotEqual(digest(first), digest(first.replace('one', 'two')))

    def test_new_updated_deleted_and_unchanged_pages(self):
        before = {'/same': 'a', '/edited': 'b', '/removed': 'c'}
        after = {'/same': 'a', '/edited': 'new', '/added': 'd'}
        self.assertEqual(changed_urls(before, after, []), ['/added', '/edited', '/removed'])

    def run_submission(self, directory, request_effect):
        root = Path(directory)
        key = '1234567890abcdef'
        (root / 'key.txt').write_text(key)
        (root / 'config.json').write_text(json.dumps({
            'origin': 'https://example.org/', 'keyFile': 'key.txt',
            'initialUrls': ['https://example.org/docs']}))
        with patch('sys.argv', ['notify', '--config', str(root / 'config.json'),
                               '--state', str(root / 'state.json'), '--report', str(root / 'report.json')]), \
             patch('notify.sitemap_urls', return_value=['https://example.org/docs']), \
             patch('notify.fingerprint_url', return_value=('https://example.org/docs', 'digest')), \
             patch('notify.request', side_effect=request_effect), redirect_stdout(io.StringIO()):
            main()

    def test_failed_submission_does_not_advance_baseline(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaises(URLError):
                self.run_submission(directory, URLError('offline'))
            self.assertFalse((Path(directory) / 'state.json').exists())

    def test_wrong_production_key_prevents_submission(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaises(ValueError):
                self.run_submission(directory, [(200, 'https://example.org/key.txt', {}, b'wrong')])
            self.assertFalse((Path(directory) / 'state.json').exists())

    def test_202_records_pending_validation_without_claiming_indexed(self):
        with tempfile.TemporaryDirectory() as directory:
            self.run_submission(directory, [
                (200, 'https://example.org/key.txt', {}, b'1234567890abcdef'),
                (202, 'https://api.indexnow.org/indexnow', {}, b'')])
            report = json.loads((Path(directory) / 'report.json').read_text())
            self.assertTrue(report['responses'][0]['keyValidationPending'])
            self.assertTrue((Path(directory) / 'state.json').exists())


if __name__ == '__main__':
    unittest.main()
