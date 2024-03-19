/**
 * This file wraps the original Main so we don't need to modify the original code.
 *
 * Reason for modifying:
 * Moved the navbar & footer to this page. 
 */

import React from 'react';
import Navbar from '@theme/Navbar';
import Main from '@theme-original/DocRoot/Layout/Main';
import type {Props} from '@theme/DocRoot/Layout/Main';
import Footer from '@theme/Footer';

export default function MainWrapper(props: Props):JSX.Element {
  return (
    <div style ={{ width: "100%" }}>
      <Navbar />
      <Main {...props} />
      <Footer />
    </div>
  );
}
