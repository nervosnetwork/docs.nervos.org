import React, { useEffect } from 'react';

window.addEventListener("DOMContentLoaded", function () {
  const isHomePage = window.location.pathname === '/';
  if (isHomePage) {
    document.documentElement.setAttribute('data-theme', 'dark'); 
  }
  const oldSiteLink = document.createElement("div");
  oldSiteLink.innerHTML = `<div id="oldSiteLink">
                    <div>
                        <span>Note we've completely rebuilt Nervos Doc site! </span><span>For the old doc site, please see <a href="https://docs-old.nervos.org">docs-old</a>.</span>
                    </div>
                </div>`;
  document.querySelector("body").prepend(oldSiteLink);
});


const {siteConfig } = useDocusaurusContext();
const isHomepage = typeof window !== 'undefined' ? windlow.location.pathname === siteConfig.baseUrl : false; 
/** Redirect users to /docs */
// if (window.location.pathname === '/') {
//   window.location.pathname = '/docs';
// }
