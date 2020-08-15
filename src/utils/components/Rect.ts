import { BoundingBox } from "../BoundingBox";
import RectangelEditor from "@/components/editors/RectangleEditor.vue";
import { Rectangular } from "./Rectangular";
import { Action } from "../Action";
import { JsonObject, getRandomColor } from "../ComponentManager";

export class Rect extends Rectangular {
  public static displayName = "Rect";
  public static icon = "crop_free";
  public displayName = Rect.displayName;
  public icon = Rect.icon;
  public vueComponent = RectangelEditor;
  public resizeable = true;

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string
  ) {
    super(id, name, clickAction, x, y, width, height);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  modify(newBoundingBox: BoundingBox): void {
    this.x = newBoundingBox.x;
    this.y = newBoundingBox.y;
    this.width = newBoundingBox.width;
    this.height = newBoundingBox.height;
  }

  toJsonObj() {
    return {
      type: Rect.displayName,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      color: this.color
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
      jsonObj.color
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
      getRandomColor()
    );
  }
}
