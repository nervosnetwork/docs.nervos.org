import { useEffect } from "react";
import NavbarLayout from "@theme/Navbar/Layout";
import NavbarContent from "@theme/Navbar/Content";
import { useLocation } from "@docusaurus/router";
import {
  ensureActiveTabInView,
  observeSidebarChanges,
  subscribeSidebarScroll,
} from "./auto-scroll";

export default function Navbar(): JSX.Element {
  const location = useLocation();

  useEffect(() => {
    ensureActiveTabInView();
  }, [location.pathname]);

  useEffect(() => {
    const unsubscribeSidebarScroll = subscribeSidebarScroll();
    const unsubscribeSidebarChanges = observeSidebarChanges();

    return () => {
      unsubscribeSidebarScroll?.();
      unsubscribeSidebarChanges?.();
    };
  }, []);

  return (
    <NavbarLayout>
      <NavbarContent />
    </NavbarLayout>
  );
}
