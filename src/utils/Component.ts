import { BoundingBox } from "./BoundingBox";
import { Point } from "./Point";

import { VueConstructor } from "vue/types/umd";
import { Action } from "./Action";
import { ListItem, ListItemGroup } from "./ListItem";
import { componentFromJson, ensureUniqueness } from "./ComponentManager";

export abstract class Component implements ListItem {
  constructor(public id: string, public clickAction: Action | null) {}

  abstract draw(context: CanvasRenderingContext2D): void;
  abstract getBoundingBox(): BoundingBox;
  abstract modify(newBoundingBox: BoundingBox): void;
  abstract get vueComponent(): VueConstructor<Vue>;
  abstract get icon(): string;
  abstract toJson(): string;

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

  private dupIds(item: ListItem) {
    item.id = ensureUniqueness(item.id + "-dup");
    if (item.isGroup()) item.getItems().forEach(this.dupIds);
  }

  duplicate(): ListItem | null {
    const nComp = componentFromJson(JSON.parse(this.toJson()));
    if (nComp) {
      this.dupIds(nComp as ListItem);
      return nComp as ListItem;
    }
    return null;
  }
}
