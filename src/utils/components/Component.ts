import { BoundingBox } from "../BoundingBox";
import { Point } from "../Point";

import { VueConstructor } from "vue/types/umd";
import { Action } from "../actions/Action";
import { ListItem, ListItemGroup } from "../ListItem";
import {
  componentFromJson,
  JsonObject,
  unregisterComponent,
  ComponentType
} from "../manager/ComponentManager";

export abstract class Component implements ListItem {
  public hideable = true;
  public resizeable = false;

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[]
  ) {}

  abstract draw(context: CanvasRenderingContext2D): void;
  abstract getBoundingBox(): BoundingBox;
  abstract modify(
    newBoundingBox: BoundingBox,
    singleAxisAction?: boolean
  ): void;
  abstract get vueComponent(): VueConstructor<Vue>;
  abstract get icon(): string;
  abstract get displayName(): ComponentType;
  abstract toJsonObj(): JsonObject;

  toJson() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      action: this.clickAction.map(action => action.toJsonObj()),
      ...this.toJsonObj()
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refineSelection(point: Point): Component {
    return this;
  }

  isGroup(): this is ListItemGroup {
    return false;
  }

  duplicate(): ListItem | null {
    const nComp = componentFromJson(JSON.parse(this.toJson()), true);
    if (nComp) {
      return nComp as ListItem;
    }
    return null;
  }

  delete() {
    unregisterComponent(this);
  }
}
