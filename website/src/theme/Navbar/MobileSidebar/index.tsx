/**
 * Original source:
 * @link https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/Navbar/MobileSidebar/index.tsx
 *
 * Reason for overriding:
 * - The default Docusaurus Navbar Sidebar only appears on screens < 996px, but we need it to be visible on screens <= 1280px.
 */
import React, { useEffect, useState } from "react";
import {
  useLockBodyScroll,
  useNavbarMobileSidebar,
} from "@docusaurus/theme-common/internal";
import NavbarMobileSidebarLayout from "@theme/Navbar/MobileSidebar/Layout";
import NavbarMobileSidebarHeader from "@theme/Navbar/MobileSidebar/Header";
import NavbarMobileSidebarPrimaryMenu from "@theme/Navbar/MobileSidebar/PrimaryMenu";
import NavbarMobileSidebarSecondaryMenu from "@theme/Navbar/MobileSidebar/SecondaryMenu";

export default function NavbarMobileSidebar(): JSX.Element | null {
  const mobileSidebar = useNavbarMobileSidebar();
  useLockBodyScroll(mobileSidebar.shown);

  // Match the server on the first render, then follow the custom breakpoint.
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1280px)");
    const update = () => setIsMobileScreen(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (!isMobileScreen) {
    return null;
  }

  return (
    <NavbarMobileSidebarLayout
      header={<NavbarMobileSidebarHeader />}
      primaryMenu={<NavbarMobileSidebarPrimaryMenu />}
      secondaryMenu={<NavbarMobileSidebarSecondaryMenu />}
    />
  );
}
