import CommonScript from "/svg/icon-sidebar-common-script.svg";
import Concept from "/svg/icon-sidebar-concept.svg";
import Ecosystem from "/svg/icon-sidebar-ecosystem.svg";
import History from "/svg/icon-sidebar-history.svg";
import HowTo from "/svg/icon-sidebar-howto.svg";
import Mining from "/svg/icon-sidebar-mining.svg";
import Molecule from "/svg/icon-sidebar-molecule.svg";
import Node from "/svg/icon-sidebar-node.svg";
import Resource from "/svg/icon-sidebar-resource.svg";
import Rocket from "/svg/icon-sidebar-rocket.svg";
import Rpc from "/svg/icon-sidebar-rpc.svg";
import Script from "/svg/icon-sidebar-script.svg";
import Structure from "/svg/icon-sidebar-structure.svg";
import Token from "/svg/icon-sidebar-token.svg";
import Tool from "/svg/icon-sidebar-tool.svg";
import Tutorial from "/svg/icon-sidebar-tutorial.svg";
import Wallet from "/svg/icon-sidebar-wallet.svg";
import Project from "/svg/icon-sidebar-project.svg";
import Contribution from "/svg/icon-sidebar-contribution.svg";
import Rust from "/svg/icon-sidebar-rust.svg";
import JS from "/svg/icon-sidebar-js.svg";
import Organization from "/svg/icon-sidebar-organization.svg";
import Feature from "/svg/icon-sidebar-feature.svg";
import SquareRocket from "/svg/square-rocket.svg";
import SquareDapp from "/svg/square-dapp.svg";
import SquareScript from "/svg/square-script.svg";
import SquareFeature from "/svg/square-feature.svg";
import SquareConcept from "/svg/square-concept.svg";
import SquareNodes from "/svg/square-nodes.svg";
import SquareMine from "/svg/square-mine.svg";
import SquareProject from "/svg/square-project.svg";
import SquareHistory from "/svg/square-history.svg";
import SquareResource from "/svg/square-resource.svg";
import SquareStructure from "/svg/square-structure.svg";

export const sidebarIconMap = {
  commonScript: CommonScript,
  concept: Concept,
  ecosystem: Ecosystem,
  history: History,
  howto: HowTo,
  mining: Mining,
  molecule: Molecule,
  node: Node,
  resource: Resource,
  rocket: Rocket,
  rpc: Rpc,
  script: Script,
  structure: Structure,
  token: Token,
  tool: Tool,
  tutorial: Tutorial,
  wallet: Wallet,
  project: Project,
  contribution: Contribution,
  rust: Rust,
  js: JS,
  organization: Organization,
  feature: Feature,
  squareRocket: SquareRocket,
  squareDapp: SquareDapp,
  squareScript: SquareScript,
  squareFeature: SquareFeature,
  squareConcept: SquareConcept,
  squareNodes: SquareNodes,
  squareMine: SquareMine,
  squareProject: SquareProject,
  squareHistory: SquareHistory,
  squareResource: SquareResource,
  squareStructure: SquareStructure,
};

export type SidebarIconName = keyof typeof sidebarIconMap;
