import { BoundingBox } from "../BoundingBox";
import { Point } from "../Point";

import { Component as VueComponent } from "vue";
import { Action } from "../actions/Action";
import { ListItem, ListItemGroup } from "../ListItem";
import {
  componentFromJson,
  JsonObject,
  unregisterComponent
} from "../manager/ComponentManager";

export type ComponentType =
  | "Rect"
  | "Group"
  | "Hover"
  | "Text"
  | "Image"
  | "View"
  | "List"
  | "Template"
  | "Remote Image"
  | "Text-Input"
  | "Click Animation"
  | "Dummy"
  | "GIF"
  | "Replica"
  | "Check";

export type JsonConverter = (
  jsonObj: JsonObject,
  clickAction: Action[]
) => Component;

export abstract class Component implements ListItem {
  public hideable = true;
  public resizeable = false;
  public actionable = true;

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
  abstract get vueComponent(): VueComponent;
  abstract get icon(): string;
  abstract get displayName(): ComponentType;
  abstract toDataObj(forUsage: boolean): JsonObject;

  setId(id: string) {
    this.id = id;
  }

  toJson(forUsage?: boolean) {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      action: this.clickAction.map(action => action.toJsonObj()),
      ...this.toDataObj(forUsage || false)
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refineSelection(point: Point): Component {
    return this;
  }

  isGroup(): this is ListItemGroup<this> {
    return false;
  }

  contains(componentId: string): boolean {
    if (this.id == componentId) return true;

    if (this.isGroup())
      return this.getItems().some(c => c.contains(componentId));

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
