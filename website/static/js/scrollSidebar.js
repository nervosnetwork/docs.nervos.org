function ensureActiveTabInView() {
  // Parent category is considered active too
  const activeItems = document.querySelectorAll(".menu__link--active");
  if (!activeItems || activeItems.length < 2) return;
  // Pick the actual active tab
  const item = activeItems[1];
  const bounding = item.getBoundingClientRect();

  if (
    bounding.top >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight)
  ) {
    // Already visible.
  } else {
    // Not visible.
    item.scrollIntoView({ block: "center", inline: "nearest" });
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
}

// Watch for changes in the entire document
function observeDocumentChanges() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" || mutation.type === "attributes") {
        ensureActiveTabInView();
      }
    }
  });

  const targetNode = document.getElementById("__docusaurus");
  if (targetNode) {
    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(targetNode, config);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ensureActiveTabInView();
  observeDocumentChanges();
});
