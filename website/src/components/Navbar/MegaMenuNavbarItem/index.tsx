import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ChevronDown from "/svg/icon-chevron-down.svg";
import { sidebarIconMap, SidebarIconName } from "../../../icons";
import styles from "./styles.module.css";

export type MegaMenuItem = {
  title: string;
  description?: string;
  href: string;
  external?: boolean;
  icon?: SidebarIconName;
  activeBaseRegex?: string;
};

export type MegaMenuNavbarItemProps = {
  label: string;
  menuId: string;
  position?: "left" | "right";
  className?: string;
  activeBaseRegex?: string;
  primaryItems: MegaMenuItem[];
  otherItems?: MegaMenuItem[];
  otherLabel?: string;
  otherCol?: 1 | 2;
};

const EVENT_NAME = "nervos:megamenu-open";
const MegaMenuNavbarItem: React.FC<MegaMenuNavbarItemProps> = ({
  label,
  menuId,
  position = "left",
  className,
  activeBaseRegex,
  primaryItems,
  otherItems = [],
  otherLabel = "OTHER",
  otherCol = 1,
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // smooth close on tab-switch / pointer move
  const closeTimerRef = useRef<number | null>(null);
  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const announceOpen = () => {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { menuId } }));
  };

  const openNow = () => {
    clearCloseTimer();
    setOpen(true);
    announceOpen();
  };

  const closeSoon = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => setOpen(false), 120);
  };

  const closeNow = () => {
    clearCloseTimer();
    setOpen(false);
  };

  // Close this menu when another opens
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ menuId: string }>;
      if (ev?.detail?.menuId && ev.detail.menuId !== menuId) setOpen(false);
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, [menuId]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isTabRouteActive =
    activeBaseRegex !== undefined &&
    new RegExp(activeBaseRegex).test(location.pathname);

  const underlineActive = isTabRouteActive || open;

  const isItemActive = (item: MegaMenuItem) => {
    if (item.activeBaseRegex)
      return new RegExp(item.activeBaseRegex).test(location.pathname);
    const base = useBaseUrl(item.href);
    return location.pathname.startsWith(base);
  };

  return (
    <>
      <div
        className={clsx(
          "navbar__item",
          styles.megaItem,
          position === "right" && styles.megaItemRight,
          underlineActive && styles.megaItemActive,
          className
        )}
        onPointerEnter={openNow}
        onPointerLeave={closeSoon}
      >
        <button
          type="button"
          className={styles.trigger}
          aria-haspopup="true"
          aria-expanded={open}
          id={`mega-${menuId}`}
          onFocus={openNow}
        >
          <span>{label}</span>
          <ChevronDown aria-hidden className={styles.chevron} />
        </button>
      </div>

      <div
        className={clsx(styles.panelWrapper, open && styles.panelWrapperOpen)}
        onPointerEnter={clearCloseTimer}
        onPointerLeave={closeSoon}
      >
        <div
          className={styles.panel}
          role="menu"
          aria-labelledby={`mega-${menuId}`}
        >
          <div className={styles.layout}>
            {/* LEFT: Primary cards */}
            <div className={styles.primaryCol}>
              {primaryItems.map((item) => {
                const Icon = item.icon ? sidebarIconMap[item.icon] : null;
                const active = isItemActive(item);

                return (
                  <Link
                    key={item.href}
                    to={useBaseUrl(item.href)}
                    className={clsx(
                      styles.primaryCard,
                      active && styles.cardActive
                    )}
                    onClick={closeNow}
                  >
                    <div className={styles.primaryInner}>
                      {Icon && (
                        <Icon
                          className={styles.primaryIcon}
                          aria-hidden="true"
                        />
                      )}
                      <div className={styles.primaryText}>
                        <div className={styles.primaryTitle}>{item.title}</div>
                        {item.description && (
                          <div className={styles.primaryDesc}>
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* RIGHT: Other list */}
            {otherItems.length > 0 && (
              <div className={styles.otherCol}>
                <div className={styles.otherLabel}>{otherLabel}</div>
                <div
                  className={clsx(
                    styles.otherList,
                    otherCol === 2 && styles.otherListTwoCols
                  )}
                >
                  {otherItems.map((item) => {
                    const Icon = item.icon ? sidebarIconMap[item.icon] : null;
                    const External = sidebarIconMap["external"];
                    const active = isItemActive(item);

                    return (
                      <Link
                        key={item.href}
                        to={item.external ? item.href : useBaseUrl(item.href)}
                        {...(item.external && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                        className={clsx(
                          styles.otherItem,
                          active && styles.cardActive
                        )}
                        onClick={closeNow}
                      >
                        {Icon && (
                          <Icon
                            className={styles.otherIcon}
                            aria-hidden="true"
                          />
                        )}
                        <span className={styles.otherTitle}>{item.title}</span>
                        {item.external && (
                          <External
                            className={styles.externalIcon}
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MegaMenuNavbarItem;
