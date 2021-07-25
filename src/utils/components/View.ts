import ViewEditor from "@/components/editors/ViewEditor.vue";
import { Component, ComponentType } from "./Component";
import { Action } from "../actions/Action";
import { JsonObject, isInvisible } from "../manager/ComponentManager";
import { GroupComponent } from "./GroupComponent";
import { Point } from "../Point";
import { markRaw } from "vue";

export class View extends GroupComponent {
  public static displayName: ComponentType = "View";
  public static icon = "view_carousel";
  public displayName = View.displayName;
  public icon = View.icon;
  public vueComponent = markRaw(ViewEditor);

  public itemClasses = ["primary"];

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public components: Component[],
    public expanded: boolean,
    public drawIndex: number
  ) {
    super(id, name, clickAction, components, expanded);
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

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    const comps: Component[] = GroupComponent.componentsFromJson(
      jsonObj.components
    );
    return new View(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      comps,
      jsonObj.expanded,
      jsonObj.drawIndex
    );
  }

  toDataObj(forUsage: boolean) {
    return {
      drawIndex: this.drawIndex,
      ...super.toDataObj(forUsage)
    };
  }

  static generator() {
    return new View("-", View.displayName, [], [], true, 0);
  }
}
