import ComponentEditor from "@/components/editors/ClickAnimationEditor.vue";
import { Component, ComponentType } from "./Component";
import { Action } from "../actions/Action";
import { JsonObject, isInvisible } from "../manager/ComponentManager";
import { GroupComponent } from "./GroupComponent";
import { Point } from "../Point";
import { markRaw } from "vue";

export class ClickAnimation extends GroupComponent {
  public static displayName: ComponentType = "Click Animation";
  public static icon = "mouse";
  public displayName = ClickAnimation.displayName;
  public icon = ClickAnimation.icon;
  public vueComponent = markRaw(ComponentEditor);

  public itemLimit = 2;
  public itemClasses = ["not-hovered", "hovered"];

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public components: Component[],
    public expanded: boolean,
    public drawClicked: boolean
  ) {
    super(id, name, clickAction, components, expanded);
  }

  getCurrentComponent(): Component | null {
    return this.drawClicked ? this.components[1] : this.components[0];
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
    return new ClickAnimation(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      comps,
      jsonObj.expanded,
      jsonObj.drawClicked
    );
  }

  toDataObj(forUsage: boolean) {
    return {
      drawClicked: this.drawClicked,
      ...super.toDataObj(forUsage)
    };
  }

  static generator() {
    return new ClickAnimation(
      "-",
      ClickAnimation.displayName,
      [],
      [],
      true,
      false
    );
  }
}
