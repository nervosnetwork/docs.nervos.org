import React from "react";
import OriginalCategory from "@theme-original/DocSidebarItem/Category";
import type { Props } from "@theme/DocSidebarItem/Category";
import { sidebarIconMap, SidebarIconName } from "../../../icons";

export default function DocSidebarItemCategoryWrapper(props: Props) {
  const iconKey = props.item.customProps?.icon as SidebarIconName | undefined;
  const Icon = iconKey ? sidebarIconMap[iconKey] : null;

  // If no icon, fall back to the original behavior
  if (!Icon) {
    return <OriginalCategory {...props} />;
  }

  const newItem = {
    ...props.item,
    label: (
      <span className="sidebarCategoryLabelWithIcon">
        <Icon className="sidebarIcon" />
        <span>{props.item.label}</span>
      </span>
    ),
  };

  return <OriginalCategory {...props} item={newItem} />;
}
