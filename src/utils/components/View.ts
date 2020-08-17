import ViewEditor from "@/components/editors/ViewEditor.vue";
import { Component } from "../Component";
import { Action } from "../Action";
import { JsonObject, isInvisible, ComponentType } from "../ComponentManager";
import { GroupComponent } from "./GroupComponent";
import { Point } from "../Point";

export class View extends GroupComponent {
  public static displayName: ComponentType = "View";
  public static icon = "view_carousel";
  public displayName = View.displayName;
  public icon = View.icon;
  public vueComponent = ViewEditor;

  public drawIndex = 0;

  public itemClasses = ["primary"];

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public components: Component[]
  ) {
    super(id, name, clickAction, components);
  }

  getCurrentComponent(): Component | null {
    return this.components[this.drawIndex] || null;
  }

  draw(context: CanvasRenderingContext2D): void {
    const draw = this.getCurrentComponent();
    if (draw && !isInvisible(draw.id)) draw.draw(context);
  }

  refineSelection(point: Point): Component {
    const current = this.getCurrentComponent();
    return current?.getBoundingBox().isInside(point) ? current : this;
  }

  static fromJson(
    jsonObj: JsonObject,
    clickAction: Action[],
    reassignIDs: boolean
  ) {
    const comps: Component[] = GroupComponent.componentsFromJson(
      jsonObj.components,
      reassignIDs
    );
    return new View(jsonObj.id, jsonObj.name, clickAction, comps);
  }

  static generator() {
    return new View("-", View.displayName, [], []);
  }
}
