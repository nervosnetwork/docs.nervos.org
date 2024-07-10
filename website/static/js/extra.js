window.addEventListener("DOMContentLoaded", function () {
  const oldSiteLink = document.createElement("div");
  oldSiteLink.innerHTML = `<div id="oldSiteLink">
                    <div>
                        <span>Note we've completely rebuilt Nervos Doc site! </span><span>For the old doc site, please see <a href="https://docs-old.nervos.org">docs-old</a>.</span>
                    </div>
                </div>`;
  document.querySelector("body").prepend(oldSiteLink);

  // Keeps track of search term in GA
  document.addEventListener("keydown", function (event) {
    const target = event.target;
    const isSearchInput =
      target.classList.contains("aa-Input") && target.type === "search";
    if (isSearchInput && event.key === "Enter") {
      window.gtag &&
        window.gtag("event", "search", {
          event_category: "Site Search",
          event_label: target.value,
        });
    }
  });
});
