
/**
 * Original source:
 * @link https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/Navbar/ColorModeToggle/index.tsx
 *
 * Reason for overriding:
 * - Update the original hover effect and styling
 */

import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import ColorModeToggle from '@theme/ColorModeToggle';
import styles from './styles.module.css';
import type { Props } from '@theme/Navbar/ColorModeToggle';

export default function NavbarColorModeToggle({className}: Props): JSX.Element {
  const {colorMode, setColorMode} = useColorMode();
  return (
    <div className={styles.colorToggleWrapper}>
      <ColorModeToggle
        className={className}
        buttonClassName={
          styles.colorToggle
        }
        value={colorMode}
        onChange={setColorMode}
      />
    </div>
  );
}
