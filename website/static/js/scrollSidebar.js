const SIDEBAR_SCROLL_TOP_KEY = "sidebarScrollTop";
const SCROLL_THRESHOLD = 20;

function ensureActiveTabInView() {
  const sidebar = document.querySelector("nav[aria-label='Docs sidebar']");

  if (sidebar) {
    const lastScrollTop = sessionStorage.getItem(SIDEBAR_SCROLL_TOP_KEY);
    console.log("Restoring sidebar scroll position:", lastScrollTop);
    if (lastScrollTop !== null) {
      sidebar.scrollTop = parseInt(lastScrollTop, 10);
    }
  }

  const activeItems = document.querySelectorAll(".menu__link--active");

  if (!activeItems || activeItems.length === 0) {
    if (sidebar) {
      sessionStorage.setItem(
        SIDEBAR_SCROLL_TOP_KEY,
        sidebar.scrollTop.toString()
      );
    }
    return;
  }
  const item = activeItems[activeItems.length - 1];

  let isItemVisibleAfterRestore = false;
  if (sidebar) {
    const itemRect = item.getBoundingClientRect();
    const sidebarRect = sidebar.getBoundingClientRect();
    console.log(itemRect, sidebarRect);
    // Check if item is visible within the sidebar's viewport
    isItemVisibleAfterRestore =
      itemRect.top >= sidebarRect.top + SCROLL_THRESHOLD &&
      itemRect.bottom <= sidebarRect.bottom - SCROLL_THRESHOLD;
  } else {
    const bounding = item.getBoundingClientRect();
    isItemVisibleAfterRestore =
      bounding.top >= 0 &&
      bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight);
  }

  // Not visible after restoring scroll, so scroll into view.
  if (!isItemVisibleAfterRestore) {
    item.scrollIntoView({ block: "center", inline: "nearest" });
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  if (sidebar) {
    sessionStorage.setItem(
      SIDEBAR_SCROLL_TOP_KEY,
      sidebar.scrollTop.toString()
    );
  }
}

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
