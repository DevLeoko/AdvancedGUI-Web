import { BoundingBox } from "../BoundingBox";
import { Point } from "../Point";
import EmptyEditor from "@/components/editors/EmptyEditor.vue";
import { Component, ComponentType } from "./Component";
import { Action } from "../actions/Action";
import { ListItemGroup } from "../ListItem";
import { Component as VueComponent, markRaw } from "vue";
import {
  componentFromJson,
  JsonObject,
  isInvisible
} from "../manager/ComponentManager";

export class GroupComponent extends Component
  implements ListItemGroup<Component> {
  public static displayName: ComponentType = "Group";
  public static icon = "folder";
  public static childComponentProps = ["components"];
  public displayName = GroupComponent.displayName;
  public icon = GroupComponent.icon;
  public vueComponent: VueComponent = markRaw(EmptyEditor);

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public components: Component[],
    public expanded: boolean
  ) {
    super(id, name, clickAction);
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

      if (cBox == BoundingBox.EMPTY) return;

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
      this.components.find(
        comp => comp.getBoundingBox().isInside(point) && !isInvisible(comp.id)
      ) || this
    );
  }

  isGroup() {
    return true;
  }

  getItems() {
    return this.components;
  }

  toDataObj(forUsage?: boolean) {
    return {
      type: this.displayName,
      components: this.components.map(comp =>
        JSON.parse(comp.toJson(forUsage))
      ),
      expanded: this.expanded
    };
  }

  static componentsFromJson(jsonObj: JsonObject[]) {
    const comps: Component[] = [];

    jsonObj.forEach(comp => {
      const converted = componentFromJson(comp);
      if (converted) comps.push(converted);
      else console.error("Invalid component: ", comp);
    });

    return comps;
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    const comps: Component[] = GroupComponent.componentsFromJson(
      jsonObj.components
    );
    return new GroupComponent(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      comps,
      jsonObj.expanded
    );
  }

  static generator() {
    return new GroupComponent("-", GroupComponent.displayName, [], [], true);
  }

  delete() {
    super.delete();

    this.components.forEach(comp => comp.delete());
  }
}
