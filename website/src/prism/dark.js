import {themes as prismThemes} from 'prism-react-renderer';

module.exports = {
  plain: {
    color: 'var(--code-plain)',
    backgroundColor: 'var(--surface-02)',
  },
  styles: [
    ...prismThemes.vsDark.styles,
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: 'var(--code-comment)',
      },
    },
    {
        types: ['constant'],
        style: {
            color: 'var(--code-constant)',
        },
    },
    {
        types: ['function'],
        style: {
            color: 'var(--code-function)',
        },
    },
],
};