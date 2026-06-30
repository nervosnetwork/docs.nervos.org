import { useEffect, useRef } from "react";
import { useLocation } from "@docusaurus/router";
import {
  getSafePagePath,
  rememberCurrentPagePath,
} from "@site/src/components/AnalyticsTracking/utils";

export default function PagePathTracker(): null {
  const location = useLocation();
  const hasTrackedInitialPagePath = useRef(false);

  useEffect(() => {
    rememberCurrentPagePath(getSafePagePath(location), {
      updatePreviousPagePath: hasTrackedInitialPagePath.current,
    });
    hasTrackedInitialPagePath.current = true;
  }, [location.pathname, location.hash]);

  return null;
}
