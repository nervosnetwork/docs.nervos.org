import { createElement, type ReactNode } from "react";
import Content from "./_SetupProjectContent.mdx";

export interface SetupProjectProp {
  imageSrc: string;
  command?: string;
  projectPath: string;
  response?: string;
  children?: ReactNode;
}

const SetupProject = (props: SetupProjectProp) => {
  //@ts-ignore
  return createElement(Content, props);
};

export default SetupProject;
