/**
 * Original source:
 * @link https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/Navbar/MobileSidebar/index.tsx
 *
 * Reason for overriding:
 * - The default Docusaurus Navbar Sidebar only appears on screens < 996px, but we need it to be visible on screens <= 1280px.
 */
import React from "react";
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

  const isMobileScreen =
    typeof window !== "undefined" && window.innerWidth <= 1280;

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
