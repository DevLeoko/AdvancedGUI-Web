import HoverEditor from "@/components/editors/HoverEditor.vue";
import { Component } from "../Component";
import { Action } from "../Action";
import { JsonObject, isInvisible } from "../ComponentManager";
import { GroupComponent } from "./GroupComponent";
import { Point } from "../Point";

export class Hover extends GroupComponent {
  public static displayName = "Hover";
  public static icon = "layers";
  public displayName = Hover.displayName;
  public icon = Hover.icon;
  public vueComponent = HoverEditor;

  public drawHovered = false;

  public itemLimit = 2;
  public itemClasses = ["not-hovered", "hovered"];

  constructor(
    public id: string,
    public clickAction: Action[],
    public components: Component[]
  ) {
    super(id, clickAction, components);
  }

  getCurrentComponent(): Component | null {
    return this.drawHovered ? this.components[1] : this.components[0];
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
    return new Hover(jsonObj.id, clickAction, comps);
  }
}
