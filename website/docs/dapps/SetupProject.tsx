import { createElement } from "react";
import Content from "./_SetupProjectContent.mdx";

export interface SetupProjectProp {
  templateName: string;
  imageSrc: string;
}

const SetupProject = (props: SetupProjectProp) => {
  //@ts-ignore
  return createElement(Content, props);
};

export default SetupProject;
