import type { ComponentTypesObject } from "@theme/NavbarItem/ComponentTypes";
import ComponentTypes from "@theme-original/NavbarItem/ComponentTypes";
import MegaMenuNavbarItem from "@site/src/components/Navbar/MegaMenuNavbarItem";

const customTypes: ComponentTypesObject = {
  ...ComponentTypes,
  "custom-megaMenu": MegaMenuNavbarItem,
};

export default customTypes;
