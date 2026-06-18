import { useEffect, useRef } from "react";
import { useLocation } from "@docusaurus/router";
import {
  getSafePagePath,
  sendAnalyticsEvent,
} from "@site/src/components/AnalyticsTracking/utils";

const SCROLL_MILESTONES = [25, 50, 75, 90, 100];

function getScrollDepth(): number {
  const element = document.documentElement;
  const body = document.body;
  const scrollTop = window.scrollY || element.scrollTop || body.scrollTop || 0;
  const viewportHeight = window.innerHeight || element.clientHeight;
  const scrollHeight = Math.max(
    element.scrollHeight,
    body.scrollHeight,
    element.offsetHeight,
    body.offsetHeight,
    element.clientHeight,
    body.clientHeight
  );

  if (scrollHeight <= viewportHeight) {
    return 100;
  }

  return Math.min(
    100,
    Math.floor(((scrollTop + viewportHeight) / scrollHeight) * 100)
  );
}

export default function ScrollDepthTracker(): null {
  const location = useLocation();
  const trackedMilestones = useRef<Set<number>>(new Set());
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    trackedMilestones.current = new Set();

    const sendScrollDepthEvents = () => {
      animationFrame.current = null;

      const scrollDepth = getScrollDepth();
      const pagePath = getSafePagePath(location);

      SCROLL_MILESTONES.forEach((milestone) => {
        if (
          scrollDepth >= milestone &&
          !trackedMilestones.current.has(milestone)
        ) {
          trackedMilestones.current.add(milestone);
          sendAnalyticsEvent("scroll_depth", {
            percent_scrolled: milestone,
            page_path: pagePath,
            page_title: document.title,
          });
        }
      });
    };

    const scheduleScrollDepthCheck = () => {
      if (animationFrame.current !== null) {
        return;
      }

      animationFrame.current = window.requestAnimationFrame(
        sendScrollDepthEvents
      );
    };

    scheduleScrollDepthCheck();
    window.addEventListener("scroll", scheduleScrollDepthCheck, {
      passive: true,
    });
    window.addEventListener("resize", scheduleScrollDepthCheck);

    return () => {
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current);
      }

      window.removeEventListener("scroll", scheduleScrollDepthCheck);
      window.removeEventListener("resize", scheduleScrollDepthCheck);
    };
  }, [location.pathname, location.hash]);

  return null;
}
