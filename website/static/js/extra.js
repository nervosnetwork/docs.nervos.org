window.addEventListener("DOMContentLoaded", function () {
  const oldSiteLink = document.createElement("div");
  oldSiteLink.innerHTML = `<div id="oldSiteLink">
                    <div>
                        <span>Note we've completely rebuilt Nervos Doc site! </span><span>For the old doc site, please see <a href="https://docs-old.nervos.org">docs-old</a>.</span>
                    </div>
                </div>`;
  document.querySelector("body").prepend(oldSiteLink);
});
