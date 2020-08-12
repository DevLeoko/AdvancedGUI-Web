import { BoundingBox } from "./BoundingBox";
import { Point } from "./Point";

import { VueConstructor } from "vue/types/umd";
import { Action } from "./Action";
import { ListItem, ListItemGroup } from "./ListItem";

export abstract class Component implements ListItem {
  constructor(public id: string, public clickAction: Action | null) {}

  abstract draw(context: CanvasRenderingContext2D): void;
  abstract getBoundingBox(): BoundingBox;
  abstract modify(newBoundingBox: BoundingBox): void;
  abstract get vueComponent(): VueConstructor<Vue>;
  abstract get icon(): string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refineSelection(point: Point): Component {
    return this;
  }

  get resizeable() {
    return false;
  }

  isGroup(): this is ListItemGroup {
    return false;
  }
}
