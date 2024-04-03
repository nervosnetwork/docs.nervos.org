window.addEventListener("DOMContentLoaded", function () {
  const oldSiteLink = document.createElement("div");
  oldSiteLink.innerHTML = `<div id="oldSiteLink">
                    <div>
                        <span>Note we've completely rebuilt Nervos Doc site! </span><span>For the new doc site, please see <a href="https://docs.nervos.org/">docs-new</a>.</span>
                    </div>
                </div>`;
  document.querySelector("body").prepend(oldSiteLink);
});
