import HoverEditor from "@/components/editors/HoverEditor.vue";
import { Component } from "../Component";
import { Action } from "../Action";
import { JsonObject, isInvisible, ComponentType } from "../ComponentManager";
import { GroupComponent } from "./GroupComponent";
import { Point } from "../Point";

export class Hover extends GroupComponent {
  public static displayName: ComponentType = "Hover";
  public static icon = "layers";
  public displayName = Hover.displayName;
  public icon = Hover.icon;
  public vueComponent = HoverEditor;

  public drawHovered = false;

  public itemLimit = 2;
  public itemClasses = ["not-hovered", "hovered"];

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public components: Component[],
    public expanded: boolean
  ) {
    super(id, name, clickAction, components, expanded);
  }

  getCurrentComponent(): Component | null {
    return this.drawHovered ? this.components[1] : this.components[0];
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
    return new Hover(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      comps,
      jsonObj.expanded
    );
  }

  static generator() {
    return new Hover("-", Hover.displayName, [], [], true);
  }
}
