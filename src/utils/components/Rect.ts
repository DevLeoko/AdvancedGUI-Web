import { BoundingBox } from "../BoundingBox";
import RectangelEditor from "@/components/editors/RectangleEditor.vue";
import { Rectangular } from "./Rectangular";
import { Action } from "../actions/Action";
import { JsonObject } from "../manager/ComponentManager";
import { markRaw } from "vue";
import { ComponentType } from "./Component";
import { getRandomColor } from "../ColorUtils";

export class Rect extends Rectangular {
  public static displayName: ComponentType = "Rect";
  public static icon = "crop_free";
  public displayName = Rect.displayName;
  public icon = Rect.icon;
  public vueComponent = markRaw(RectangelEditor);
  public resizeable = true;

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string,
    public radius: number
  ) {
    super(id, name, clickAction, x, y, width, height);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.color;
    // context.fillRect(this.x, this.y, this.width, this.height);

    context.beginPath();
    context.moveTo(this.x + this.radius, this.y);
    context.lineTo(this.x + this.width - this.radius, this.y);
    context.quadraticCurveTo(
      this.x + this.width,
      this.y,
      this.x + this.width,
      this.y + this.radius
    );
    context.lineTo(this.x + this.width, this.y + this.height - this.radius);
    context.quadraticCurveTo(
      this.x + this.width,
      this.y + this.height,
      this.x + this.width - this.radius,
      this.y + this.height
    );
    context.lineTo(this.x + this.radius, this.y + this.height);
    context.quadraticCurveTo(
      this.x,
      this.y + this.height,
      this.x,
      this.y + this.height - this.radius
    );
    context.lineTo(this.x, this.y + this.radius);
    context.quadraticCurveTo(this.x, this.y, this.x + this.radius, this.y);
    context.closePath();
    context.fill();
  }

  modify(newBoundingBox: BoundingBox): void {
    this.x = newBoundingBox.x;
    this.y = newBoundingBox.y;
    this.width = newBoundingBox.width;
    this.height = newBoundingBox.height;
  }

  toDataObj() {
    return {
      type: Rect.displayName,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      color: this.color,
      radius: this.radius
    };
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    return new Rect(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      jsonObj.x,
      jsonObj.y,
      jsonObj.width,
      jsonObj.height,
      jsonObj.color,
      jsonObj.radius
    );
  }

  static generator() {
    return new Rect(
      "-",
      Rect.displayName,
      [],
      10,
      10,
      80,
      40,
      getRandomColor(),
      0
    );
  }
}
