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

document.addEventListener("DOMContentLoaded", ensureActiveTabInView);

export default ensureActiveTabInView;
