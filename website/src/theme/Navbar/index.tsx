import { useEffect, useRef } from "react";
import NavbarLayout from "@theme/Navbar/Layout";
import NavbarContent from "@theme/Navbar/Content";
import { useLocation } from "@docusaurus/router";
import {
  ensureActiveTabInView,
  observeDocumentChanges,
  subscribeSidebarScroll,
} from "./auto-scroll";

export default function Navbar(): JSX.Element {
  const isMounted = useRef(false);
  const location = useLocation();

  useEffect(() => {
    ensureActiveTabInView();

    const unsubscribeSidebarScroll = subscribeSidebarScroll();
    const unsubscribeDocumentChanges = observeDocumentChanges();

    isMounted.current = true;
    return () => {
      unsubscribeSidebarScroll?.();
      unsubscribeDocumentChanges?.();
    };
  }, [location.pathname]);

  return (
    <NavbarLayout>
      <NavbarContent />
    </NavbarLayout>
  );
}
