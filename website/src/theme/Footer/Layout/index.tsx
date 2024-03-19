/**
 * This file wraps the original Main so we don't need to modify the original code.
 *
 * Reason for modifying:
 * Moved the navbar & footer to this page. 
 */
import React from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/Footer/Layout';

export default function FooterLayout({style, links, logo, copyright}: Props): JSX.Element {
  return (
    <footer
      className={clsx('footer', {
        'footer--dark': style === 'dark',
      })}>
      <div className='footer-leftContainer'>
        <div className='footer-logo'>{logo}</div>
        <p className='footer-copyright'>{copyright}</p>
      </div>
      {links}
    </footer>
  );
}
