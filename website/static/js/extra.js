window.addEventListener("DOMContentLoaded", function () {
  const oldSiteLink = document.createElement("div");
  oldSiteLink.innerHTML = `<div id="oldSiteLink">
                    <div>
                        <span>Note we've completely rebuilt Nervos Doc site! </span><span>For the old doc site, please see <a href="https://nervos-ckb-docs-git-v1-cryptape.vercel.app/">docs-old</a>.</span>
                    </div>
                </div>`;
  document.querySelector("body").prepend(oldSiteLink);
});

/** Redirect users to /docs */
if (window.location.pathname === '/') {
  window.location.pathname = '/docs';
}
