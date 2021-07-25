import HoverEditor from "@/components/editors/HoverEditor.vue";
import { Component, ComponentType } from "./Component";
import { Action } from "../actions/Action";
import { JsonObject, isInvisible } from "../manager/ComponentManager";
import { GroupComponent } from "./GroupComponent";
import { Point } from "../Point";
import { markRaw } from "vue";

export class Hover extends GroupComponent {
  public static displayName: ComponentType = "Hover";
  public static icon = "layers";
  public displayName = Hover.displayName;
  public icon = Hover.icon;
  public vueComponent = markRaw(HoverEditor);

  public itemLimit = 2;
  public itemClasses = ["not-hovered", "hovered"];

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public components: Component[],
    public expanded: boolean,
    public drawHovered: boolean
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

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    const comps: Component[] = GroupComponent.componentsFromJson(
      jsonObj.components
    );
    return new Hover(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      comps,
      jsonObj.expanded,
      jsonObj.drawHovered
    );
  }

  toDataObj(forUsage: boolean) {
    return {
      drawHovered: this.drawHovered,
      ...super.toDataObj(forUsage)
    };
  }

  static generator() {
    return new Hover("-", Hover.displayName, [], [], true, false);
  }
}
