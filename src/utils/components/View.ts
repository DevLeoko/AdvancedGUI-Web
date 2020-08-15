import ViewEditor from "@/components/editors/ViewEditor.vue";
import { Component } from "../Component";
import { Action } from "../Action";
import { JsonObject, isInvisible } from "../ComponentManager";
import { GroupComponent } from "./GroupComponent";
import { Point } from "../Point";

export class View extends GroupComponent {
  public static displayName = "View";
  public static icon = "view_carousel";
  public displayName = View.displayName;
  public icon = View.icon;
  public vueComponent = ViewEditor;

  public drawIndex = 0;

  public itemClasses = ["primary"];

  constructor(
    public id: string,
    public clickAction: Action[],
    public components: Component[]
  ) {
    super(id, clickAction, components);
  }

  getCurrentComponent(): Component | null {
    return this.components[this.drawIndex] || null;
  }

  draw(context: CanvasRenderingContext2D): void {
    const draw = this.getCurrentComponent();
    if (draw && !isInvisible(draw.id)) draw.draw(context);
  }

  refineSelection(point: Point): Component {
    const found = super.refineSelection(point);
    if (found == this.getCurrentComponent()) return found;
    return this;
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    const comps: Component[] = GroupComponent.componentsFromJson(
      jsonObj.components
    );
    return new View(jsonObj.id, clickAction, comps);
  }
}
