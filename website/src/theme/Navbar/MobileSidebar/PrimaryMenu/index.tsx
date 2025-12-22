import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import SearchBar from "@theme/SearchBar";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { useLocation } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import { MegaMenuItem } from "@site/src/components/Navbar/MegaMenuNavbarItem";

import { sidebarIconMap, type SidebarIconName } from "../../../../icons";

/* ---------- Types ---------- */

type MegaMenuNavbarItem = {
  type: "custom-megaMenu";
  label: string;
  menuId: string;
  activeBaseRegex?: string;
  primaryItems: MegaMenuItem[];
  otherItems?: MegaMenuItem[];
  otherLabel?: string;
};

/* ---------- Helpers ---------- */

function isMegaMenu(item: any): item is MegaMenuNavbarItem {
  return item?.type === "custom-megaMenu";
}

function isActive(
  pathname: string,
  item: { href?: string; activeBaseRegex?: string }
) {
  const normalizedPathname = pathname.replace(/^\/docs(?=\/)/, "");

  if (item.activeBaseRegex) {
    try {
      return new RegExp(item.activeBaseRegex).test(normalizedPathname);
    } catch {
      return false;
    }
  }

  if (!item.href) return false;

  const base = useBaseUrl(item.href);
  return (
    normalizedPathname === base || normalizedPathname.startsWith(base + "/")
  );
}

function resolveIcon(name?: SidebarIconName) {
  return name ? sidebarIconMap[name] : null;
}

/* ---------- UI ---------- */

function MenuRow({
  label,
  active,
  open,
  onToggle,
  children,
}: {
  label: string;
  active: boolean;
  open: boolean;
  onToggle: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <details
      className={styles.details}
      open={open}
      onToggle={(e) => onToggle((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className={styles.summary}>
        <span
          className={clsx(styles.summaryLabel, active && styles.activeText)}
        >
          {label}
        </span>
        <span className={styles.chevron} />
      </summary>
      {children}
    </details>
  );
}

function PrimaryItem({
  item,
  pathname,
  onClick,
}: {
  item: MegaMenuItem;
  pathname: string;
  onClick: () => void;
}) {
  const Icon = resolveIcon(item.icon);
  const active = isActive(pathname, item);

  return (
    <Link
      to={useBaseUrl(item.href)}
      className={clsx(styles.primaryItem, active && styles.activeText)}
      onClick={onClick}
    >
      {Icon && <Icon width={40} height={40} aria-hidden />}
      <div>
        <div className={clsx(styles.primaryTitle, active && styles.activeText)}>
          {item.title}
        </div>
        {item.description && (
          <div
            className={clsx(styles.primaryDesc, active && styles.activeText)}
          >
            {item.description}
          </div>
        )}
      </div>
    </Link>
  );
}

function OtherItem({
  item,
  pathname,
  onClick,
  external = false,
}: {
  item: MegaMenuItem;
  pathname: string;
  external?: boolean;
  onClick: () => void;
}) {
  const Icon = resolveIcon(item.icon);
  const External = sidebarIconMap["external"];
  const active = isActive(pathname, item);

  return (
    <Link
      to={item.external ? item.href : useBaseUrl(item.href)}
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      className={clsx(styles.otherItem, active && styles.activeText)}
      onClick={onClick}
    >
      {Icon && <Icon width={24} height={24} aria-hidden />}
      <span className={clsx(styles.otherTitle, active && styles.activeText)}>
        {item.title}
      </span>
      {item.external && (
        <External className={styles.externalIcon} aria-hidden="true" />
      )}
    </Link>
  );
}

/* ---------- Main ---------- */

export default function NavbarMobilePrimaryMenu(): JSX.Element {
  const { navbar } = useThemeConfig() as any;
  const menus: MegaMenuNavbarItem[] = (navbar.items ?? []).filter(isMegaMenu);

  const mobileSidebar = useNavbarMobileSidebar();
  const close = () => mobileSidebar.toggle();

  const { pathname } = useLocation();

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const next: Record<string, boolean> = {};
    menus.forEach((menu) => {
      if (isActive(pathname, menu)) {
        next[menu.menuId] = true;
      }
    });
    setOpenMap((prev) => ({ ...prev, ...next }));
  }, [pathname, menus]);

  return (
    <div className={styles.mobileNav}>
      <div className={styles.mobileSearchRow}>
        <SearchBar />
      </div>

      {/* Groups */}
      <div className={styles.groups}>
        {menus.map((menu) => {
          const active = isActive(pathname, menu);
          const open = openMap[menu.menuId] ?? false;

          return (
            <MenuRow
              key={menu.menuId}
              label={menu.label}
              active={active}
              open={open}
              onToggle={(next) =>
                setOpenMap((prev) => ({
                  ...prev,
                  [menu.menuId]: next,
                }))
              }
            >
              <div>
                {menu.primaryItems.map((item) => (
                  <PrimaryItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onClick={close}
                  />
                ))}
              </div>

              {menu.otherItems?.length ? (
                <>
                  <div className={styles.otherLabel}>
                    {menu.otherLabel || "OTHER"}
                  </div>
                  <div className={styles.otherLinks}>
                    {menu.otherItems.map((item) => (
                      <OtherItem
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        onClick={close}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </MenuRow>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className={styles.footer}>
        <Link
          href={"https://discord.gg/4Jcw8MwEEv"}
          className={styles.helpButton}
          onClick={close}
        >
          <img
            src="/svg/logo-media-discord.svg"
            width={24}
            height={24}
            alt="Get Help from Discord"
          />
          {"Get Help"}
        </Link>
      </div>
    </div>
  );
}
