const SIDEBAR_SCROLL_TOP_KEY = "sidebarScrollTop";

export function ensureActiveTabInView() {
  const sidebar = document.querySelector("nav[aria-label='Docs sidebar']");

  if (sidebar) {
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
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    item.scrollIntoView({ block: "nearest", inline: "nearest" });
    window.scrollTo(scrollX, scrollY);
  }

  if (sidebar) {
    sessionStorage.setItem(
      SIDEBAR_SCROLL_TOP_KEY,
      sidebar.scrollTop.toString()
    );
  }
}

export function observeSidebarChanges() {
  const label = "Docs sidebar";
  const sidebar = document.querySelector(`nav[aria-label='${label}']`);
  if (!sidebar) {
    return () => {};
  }

  let rafId: number | null = null;

  const observer = new MutationObserver(() => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      ensureActiveTabInView();
    });
  });

  observer.observe(sidebar, {
    childList: true,
    subtree: true,
  });

  return () => {
    observer.disconnect();
    if (rafId !== null) cancelAnimationFrame(rafId);
  };
}

export function subscribeSidebarScroll() {
  const sidebar = document.querySelector("nav[aria-label='Docs sidebar']");
  if (!sidebar) {
    return;
  }

  const handleScroll = () => {
    sessionStorage.setItem(
      SIDEBAR_SCROLL_TOP_KEY,
      sidebar.scrollTop.toString()
    );
  };

  sidebar.addEventListener("scroll", handleScroll);
  return () => {
    sidebar.removeEventListener("scroll", handleScroll);
  };
}
