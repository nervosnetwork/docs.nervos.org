const SIDEBAR_SCROLL_TOP_KEY = "sidebarScrollTop";
const SCROLL_THRESHOLD = 20;

function ensureActiveTabInView() {
  const sidebar = document.querySelector("nav[aria-label='Docs sidebar']");

  if (sidebar) {
    // Hide the scrollbar for better UX
    sidebar.style = `
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
      &::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
      }
    `;
    const lastScrollTop = sessionStorage.getItem(SIDEBAR_SCROLL_TOP_KEY);
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
    // Check if item is visible within the sidebar's viewport
    isItemVisibleAfterRestore =
      itemRect.top >= sidebarRect.top && itemRect.bottom <= sidebarRect.bottom;
  } else {
    const bounding = item.getBoundingClientRect();
    isItemVisibleAfterRestore =
      bounding.top >= 0 &&
      bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight);
  }

  // Not visible after restoring scroll, so scroll into view.
  if (!isItemVisibleAfterRestore) {
    item.scrollIntoView({ block: "nearest", inline: "nearest" });
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  if (sidebar) {
    sessionStorage.setItem(
      SIDEBAR_SCROLL_TOP_KEY,
      sidebar.scrollTop.toString()
    );
    // Restore the scrollbar style
    sidebar.style = undefined;
  }
}

function observeDocumentChanges() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "childList" ||
        (mutation.type === "attributes" && mutation.attributeName === "class")
      ) {
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

  const sidebar = document.querySelector("nav[aria-label='Docs sidebar']");
  if (sidebar) {
    sessionStorage.setItem(
      SIDEBAR_SCROLL_TOP_KEY,
      sidebar.scrollTop.toString()
    );
    sidebar.addEventListener("scroll", debouncedSaveScrollPosition);
  }
});
