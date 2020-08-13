import { BoundingBox } from "./BoundingBox";
import { Point } from "./Point";

import { VueConstructor } from "vue/types/umd";
import { Action } from "./Action";
import { ListItem, ListItemGroup } from "./ListItem";
import {
  componentFromJson,
  ensureUniqueness,
  JsonObject
} from "./ComponentManager";

export abstract class Component implements ListItem {
  public hideable = true;

  constructor(public id: string, public clickAction: Action[]) {}

  abstract draw(context: CanvasRenderingContext2D): void;
  abstract getBoundingBox(): BoundingBox;
  abstract modify(newBoundingBox: BoundingBox): void;
  abstract get vueComponent(): VueConstructor<Vue>;
  abstract get icon(): string;
  abstract toJsonObj(): JsonObject;

  toJson() {
    return JSON.stringify({
      id: this.id,
      action: this.clickAction.forEach(action => action.toJsonObj()),
      ...this.toJsonObj()
    });
  }

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
    if (item.isGroup()) item.getItems().forEach(comp => this.dupIds(comp));
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
