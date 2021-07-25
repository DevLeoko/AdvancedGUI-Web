import CheckComponentEditor from "@/components/editors/CheckComponentEditor.vue";
import { Component, ComponentType } from "./Component";
import { Action } from "../actions/Action";
import { JsonObject, isInvisible } from "../manager/ComponentManager";
import { GroupComponent } from "./GroupComponent";
import { Point } from "../Point";
import { Check } from "../checks/Check";
import { checkFromJson } from "../manager/CheckManager";
import { PermissionCheck } from "../checks/PermissionCheck";
import { markRaw } from "vue";

export class CheckComponent extends GroupComponent {
  public static displayName: ComponentType = "Check";
  public static icon = "fact_check";
  public displayName = CheckComponent.displayName;
  public icon = CheckComponent.icon;
  public vueComponent = markRaw(CheckComponentEditor);

  public itemLimit = 2;
  public itemClasses = ["posAction", "negAction"];

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public components: Component[],
    public expanded: boolean,
    public drawNegative: boolean,
    public check: Check
  ) {
    super(id, name, clickAction, components, expanded);
  }

  getCurrentComponent(): Component | null {
    return this.drawNegative ? this.components[1] : this.components[0];
  }

  draw(context: CanvasRenderingContext2D): void {
    const draw = this.getCurrentComponent();
    if (draw && !isInvisible(draw.id)) draw.draw(context);
  }

  refineSelection(point: Point): Component {
    const current = this.getCurrentComponent();
    return current?.getBoundingBox().isInside(point) ? current : this;
  }

  toDataObj(forUsage: boolean) {
    return {
      check: {
        type: this.check.name,
        ...this.check.toCheckDataObj()
      },
      drawNegative: this.drawNegative,
      ...super.toDataObj(forUsage)
    };
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    const comps: Component[] = GroupComponent.componentsFromJson(
      jsonObj.components
    );
    return new CheckComponent(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      comps,
      jsonObj.expanded,
      jsonObj.drawNegative,
      checkFromJson(jsonObj.check, jsonObj.check.type)
    );
  }

  static generator() {
    return new CheckComponent(
      "-",
      CheckComponent.displayName,
      [],
      [],
      true,
      false,
      PermissionCheck.generator()
    );
  }
}
