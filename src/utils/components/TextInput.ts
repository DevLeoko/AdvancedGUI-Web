import { BoundingBox } from "../BoundingBox";
import ComponentEditor from "@/components/editors/TextInputEditor.vue";
import { Action } from "../actions/Action";
import { JsonObject } from "../manager/ComponentManager";
import { markRaw } from "vue";
import { Rectangular } from "./Rectangular";
import { hexToRgba } from "../ColorUtils";
import { ComponentType } from "./Component";

export class TextInput extends Rectangular {
  public static displayName: ComponentType = "Text-Input";
  public static icon = "keyboard";
  public displayName = TextInput.displayName;
  public icon = TextInput.icon;
  public resizeable = true;
  public vueComponent = markRaw(ComponentEditor);

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public padding: number,
    public backgroundColor: string,
    public backgroundColorActive: string,
    public defaultInput: string,
    public placeHolder: string,
    public maxLength: number,
    public fontColor: string,
    public fontColorPlaceholder: string,
    public font: string,
    public size: number
  ) {
    super(id, name, clickAction, x, y, width, height);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.backgroundColor;
    context.fillRect(this.x, this.y, this.width, this.height);

    context.font = `${this.size}px ${this.font}`;
    if (this.defaultInput) context.fillStyle = this.fontColor;
    else context.fillStyle = this.fontColorPlaceholder;
    context.fillText(
      this.defaultInput || this.placeHolder,
      this.x + this.padding,
      this.y + this.height - this.padding
    );
  }

  modify(newBoundingBox: BoundingBox): void {
    this.x = newBoundingBox.x;
    this.y = newBoundingBox.y;
    this.width = newBoundingBox.width;
    this.height = newBoundingBox.height;
  }

  toDataObj() {
    return {
      type: TextInput.displayName,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      padding: this.padding,
      backgroundColor: this.backgroundColor,
      backgroundColorActive: this.backgroundColorActive,
      defaultInput: this.defaultInput,
      placeHolder: this.placeHolder,
      maxLength: this.maxLength,
      fontColor: this.fontColor,
      fontColorPlaceholder: this.fontColorPlaceholder,
      font: this.font,
      size: this.size
    };
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    return new TextInput(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      jsonObj.x,
      jsonObj.y,
      jsonObj.width,
      jsonObj.height,
      jsonObj.padding,
      jsonObj.backgroundColor,
      jsonObj.backgroundColorActive,
      jsonObj.defaultInput,
      jsonObj.placeHolder,
      jsonObj.maxLength,
      jsonObj.fontColor,
      jsonObj.fontColorPlaceholder,
      jsonObj.font,
      jsonObj.size
    );
  }

  static generator() {
    return new TextInput(
      "-",
      TextInput.displayName,
      [],
      10,
      10,
      64,
      20,
      3,
      hexToRgba("#2d5380", 1),
      hexToRgba("#042c5d", 1),
      "",
      "Name...",
      7,
      hexToRgba("#eeeeee", 1),
      hexToRgba("#c4c4c4", 1),
      "VT323",
      20
    );
  }
}
