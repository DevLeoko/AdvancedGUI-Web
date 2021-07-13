import { GroupComponent } from "./components/GroupComponent";
import { Font } from "./manager/FontManager";

export interface Project {
  name: string;
  version: string;
  invisible: string[];
  width: number;
  height: number;
  fonts?: Font[];
  images?: {
    name: string;
    data: string;
  }[];
  gifs?: {
    name: string;
    data: string;
  }[];
  componentTree: GroupComponent;
  exportedTree: {
    draft: GroupComponent;
    finalized?: GroupComponent;
  };
}

export interface ProjectTransferData {
  invisible: string[];
  componentTree: GroupComponent;
}
