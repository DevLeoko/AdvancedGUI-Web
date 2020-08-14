import { BoundingBox } from "../BoundingBox";
import { Point } from "../Point";
import EmptyEditor from "@/components/editors/EmptyEditor.vue";
import { VueConstructor } from "vue/types/umd";
import { Component } from "../Component";
import { Action } from "../Action";
import { ListItemGroup } from "../ListItem";
import {
  componentFromJson,
  JsonObject,
  isInvisible
} from "../ComponentManager";

export class GroupComponent extends Component implements ListItemGroup {
  constructor(
    public id: string,
    public clickAction: Action[],
    public components: Component[]
  ) {
    super(id, clickAction);
  }

  draw(context: CanvasRenderingContext2D): void {
    for (let i = this.components.length - 1; i >= 0; i--) {
      const element = this.components[i];
      if (!isInvisible(element.id)) element.draw(context);
    }
  }

  getBoundingBox(): BoundingBox {
    let minX = -1,
      minY = -1,
      maxX = 0,
      maxY = 0;
    this.components.forEach(comp => {
      const cBox = comp.getBoundingBox();

      if (cBox.x < minX || minX == -1) minX = cBox.x;
      if (cBox.y < minY || minY == -1) minY = cBox.y;

      if (cBox.x + cBox.width > maxX) maxX = cBox.x + cBox.width;
      if (cBox.y + cBox.height > maxY) maxY = cBox.y + cBox.height;
    });

    return new BoundingBox(minX, minY, maxX - minX, maxY - minY);
  }

  modify(newBoundingBox: BoundingBox): void {
    const oldBox = this.getBoundingBox();
    const diffX = newBoundingBox.x - oldBox.x;
    const diffY = newBoundingBox.y - oldBox.y;

    this.components.forEach(comp => {
      const compBox = comp.getBoundingBox();
      comp.modify(
        new BoundingBox(
          compBox.x + diffX,
          compBox.y + diffY,
          compBox.width,
          compBox.height
        )
      );
    });
  }

  refineSelection(point: Point): Component {
    return (
      this.components.find(comp => comp.getBoundingBox().isInside(point)) ||
      this
    );
  }

  get vueComponent(): VueConstructor<Vue> {
    return EmptyEditor;
  }

  get icon() {
    return "folder";
  }

  static get icon() {
    return "folder";
  }

  static get displayName() {
    return "Group";
  }

  isGroup() {
    return true;
  }

  getItems() {
    return this.components;
  }

  toJsonObj() {
    return {
      type: GroupComponent.displayName,
      components: this.components.map(comp => JSON.parse(comp.toJson()))
    };
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    const comps: Component[] = [];

    (jsonObj.components as JsonObject[]).forEach(comp => {
      const converted = componentFromJson(comp);
      if (converted) comps.push(converted);
      else console.error("Invalid component: ", comp);
    });

    return new GroupComponent(jsonObj.id, clickAction, comps);
  }
}