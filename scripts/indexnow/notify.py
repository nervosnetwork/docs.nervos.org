#!/usr/bin/env python3
"""Notify IndexNow of changes observed on the deployed production website.

Uses only the Python standard library. The snapshot contains URL/content hashes,
not downloaded pages. A failed crawl or submission never advances the snapshot.
"""

import argparse
import concurrent.futures
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET
import gzip


def normalized(url):
    parts = urlsplit(url)
    return urlunsplit((parts.scheme, parts.netloc, parts.path.rstrip('/'), parts.query, ''))


def same_origin(url, origin):
    return urlsplit(url)[:2] == urlsplit(origin)[:2]


def request(url, data=None):
    headers = {'User-Agent': 'ProductionIndexNowMonitor/1.0', 'Accept-Encoding': 'identity'}
    if data is not None:
        headers['Content-Type'] = 'application/json; charset=utf-8'
    for attempt in range(3):
        try:
            with urlopen(Request(url, data=data, headers=headers), timeout=30) as response:
                body = response.read(20_000_001)
                if len(body) > 20_000_000:
                    raise ValueError('Response exceeds 20 MB: ' + url)
                return response.status, response.url, response.headers, body
        except HTTPError as error:
            if data is None and error.code in (404, 410):
                return error.code, error.url, error.headers, b''
            if error.code != 429 and error.code < 500:
                raise
            if attempt == 2:
                raise
        except (URLError, TimeoutError):
            if attempt == 2:
                raise
        time.sleep(2 ** attempt)


class Page(HTMLParser):
    ignored_tags = {'script', 'style', 'svg', 'noscript', 'template', 'nav', 'header', 'footer', 'aside'}

    def __init__(self, url):
        super().__init__(convert_charrefs=True)
        self.url = url
        self.ignored = {}
        self.in_body = self.in_main = self.in_title = 0
        self.has_main = False
        self.body, self.main, self.title = [], [], []
        self.description = ''
        self.noindex = False
        self.canonical = None

    def append(self, value):
        if not any(self.ignored.values()):
            if self.in_body:
                self.body.append(value)
            if self.in_main:
                self.main.append(value)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in self.ignored_tags and (tag in {'script', 'style', 'svg', 'noscript', 'template'} or not self.in_main):
            self.ignored[tag] = self.ignored.get(tag, 0) + 1
        if tag == 'body':
            self.in_body += 1
        if tag == 'main':
            self.has_main = True
            self.in_main += 1
        if tag == 'title':
            self.in_title += 1
        if tag == 'meta':
            name = attrs.get('name', '').lower()
            content = attrs.get('content', '')
            if name in ('robots', 'googlebot', 'bingbot'):
                self.noindex |= bool(re.search(r'\b(noindex|none)\b', content.lower()))
            if name == 'description':
                self.description = content
        if tag == 'link' and 'canonical' in attrs.get('rel', '').lower().split():
            self.canonical = urljoin(self.url, attrs.get('href', ''))
        if tag == 'a' and attrs.get('href'):
            self.append('LINK:' + urljoin(self.url, attrs['href']))
        if tag == 'img':
            self.append('IMAGE:' + attrs.get('alt', '') + ':' + attrs.get('src', ''))

    def handle_endtag(self, tag):
        if tag in self.ignored:
            self.ignored[tag] = max(0, self.ignored[tag] - 1)
        if tag == 'body':
            self.in_body = max(0, self.in_body - 1)
        if tag == 'main':
            self.in_main = max(0, self.in_main - 1)
        if tag == 'title':
            self.in_title = max(0, self.in_title - 1)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_data(self, data):
        if self.in_title:
            self.title.append(data)
        self.append(data)

    def fingerprint(self):
        if self.noindex or (self.canonical and normalized(self.canonical) != normalized(self.url)):
            return None
        content = ' '.join(self.main if self.has_main else self.body).split()
        if not content:
            raise ValueError('No readable page content: ' + self.url)
        value = json.dumps([' '.join(self.title), self.description, content], ensure_ascii=False)
        return hashlib.sha256(value.encode()).hexdigest()


def sitemap_urls(origin, sitemap):
    pending = [urljoin(origin, sitemap)]
    visited, urls = set(), set()
    while pending:
        url = pending.pop()
        if url in visited:
            continue
        if not same_origin(url, origin) or len(visited) >= 50:
            raise ValueError('Invalid or excessive sitemap index: ' + url)
        visited.add(url)
        status, final, _, data = request(url)
        if status != 200 or not same_origin(final, origin):
            raise ValueError('Sitemap fetch failed: ' + url)
        if data.startswith(b'\x1f\x8b'):
            data = gzip.decompress(data)
        root = ET.fromstring(data)
        kind = root.tag.rsplit('}', 1)[-1]
        locations = [(element.text or '').strip() for element in root.iter()
                     if element.tag.rsplit('}', 1)[-1] == 'loc']
        if kind == 'sitemapindex':
            pending.extend(locations)
        elif kind == 'urlset':
            for location in locations:
                if not same_origin(location, origin) or urlsplit(location).fragment:
                    raise ValueError('Sitemap contains an unexpected URL: ' + location)
                urls.add(location)
        else:
            raise ValueError('Unsupported sitemap format: ' + url)
    if not urls or len(urls) > 2000:
        raise ValueError('Expected between 1 and 2000 sitemap URLs')
    return sorted(urls)


def fingerprint_url(url):
    status, final, headers, data = request(url)
    if status in (404, 410) or normalized(final) != normalized(url):
        return url, None
    if re.search(r'\b(noindex|none)\b', headers.get('X-Robots-Tag', '').lower()):
        return url, None
    if 'text/html' not in headers.get('Content-Type', '').lower():
        raise ValueError('Expected HTML: ' + url)
    page = Page(url)
    page.feed(data.decode('utf-8'))
    return url, page.fingerprint()


def changed_urls(previous, current, seeds):
    if previous is None:
        # Establish a baseline without backfilling every historical page.
        return sorted(url for url in current if normalized(url) in {normalized(seed) for seed in seeds})
    return sorted(url for url in previous.keys() | current.keys()
                  if previous.get(url) != current.get(url))


def atomic_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')
    temporary.replace(path)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', default='indexnow.json')
    parser.add_argument('--state', default='.indexnow/state.json')
    parser.add_argument('--report', default='.indexnow/report.json')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    config_path = Path(args.config)
    config = json.loads(config_path.read_text())
    origin = config['origin'].rstrip('/') + '/'
    if urlsplit(origin).scheme != 'https' or urlsplit(origin).path != '/':
        raise ValueError('origin must be an HTTPS site root')
    key_path = config_path.parent / config['keyFile']
    key = key_path.read_text().strip()
    if not re.fullmatch(r'[a-zA-Z0-9-]{8,128}', key):
        raise ValueError('Invalid IndexNow key')
    key_url = urljoin(origin, key_path.name)
    seeds = config['initialUrls']
    if not all(same_origin(url, origin) for url in seeds):
        raise ValueError('Initial URLs must belong to origin')
    previous = None
    state_path = Path(args.state)
    if state_path.exists():
        saved = json.loads(state_path.read_text())
        if saved.get('version') != 1 or saved.get('origin') != origin:
            raise ValueError('Snapshot version/origin mismatch')
        previous = saved['pages']
    sitemap = sitemap_urls(origin, config.get('sitemap', '/sitemap.xml'))
    excluded = {normalized(urljoin(origin, path)) for path in config.get('excludePaths', [])}
    urls = sorted({normalized(url) for url in sitemap + seeds} - excluded)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        current = {url: digest for url, digest in pool.map(fingerprint_url, urls) if digest}
    # Protect against outages returning a nonindexable error/challenge page.
    if not current or (previous and len(current) < len(previous) / 2):
        raise ValueError('Indexable URL count dropped by more than 50%; review before notifying')
    changes = changed_urls(previous, current, seeds)
    report = {'origin': origin, 'dryRun': args.dry_run, 'baseline': previous is None,
              'sitemapUrls': len(sitemap), 'scannedUrls': len(urls), 'excludedUrls': sorted(excluded),
              'indexableUrls': len(current), 'changedUrls': changes,
              'responses': [], 'note': 'Acknowledgement is not a guarantee of indexing.'}
    if changes and not args.dry_run:
        status, final, _, data = request(key_url)
        if status != 200 or final != key_url or data.decode('utf-8').strip() != key:
            raise ValueError('Production key file is unavailable or mismatched')
        payload = json.dumps({'host': urlsplit(origin).netloc, 'key': key,
                              'keyLocation': key_url, 'urlList': changes}).encode()
        status, _, _, _ = request('https://api.indexnow.org/indexnow', payload)
        if status not in (200, 202):
            raise ValueError('Unexpected IndexNow response: ' + str(status))
        report['responses'].append({'status': status, 'urls': len(changes),
                                    'keyValidationPending': status == 202})
    atomic_json(Path(args.report), report)
    if not args.dry_run:
        atomic_json(state_path, {'version': 1, 'origin': origin, 'pages': current})
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
