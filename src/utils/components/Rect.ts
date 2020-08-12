import { BoundingBox } from "../BoundingBox";
import RectangelEditor from "@/components/RectangleEditor.vue";
import { VueConstructor } from "vue/types/umd";
import { Rectangular } from "./Rectangular";
import { Action } from "../Action";

export class Rect extends Rectangular {
  constructor(
    public id: string,
    public clickAction: Action | null,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string
  ) {
    super(id, clickAction, x, y, width, height);
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

  get resizeable() {
    return true;
  }

  get vueComponent(): VueConstructor<Vue> {
    return RectangelEditor;
  }

  get icon() {
    return "crop_square";
  }
}
