import { BoundingBox } from "../BoundingBox";
import TextEditor from "@/components/editors/TextEditor.vue";
import { Action } from "../actions/Action";
import { JsonObject, ComponentType } from "../manager/ComponentManager";
import { Component } from "./Component";
import { markRaw } from "vue";

export class Text extends Component {
  public static displayName: ComponentType = "Text";
  public static icon = "text_fields";
  public displayName = Text.displayName;
  public icon = Text.icon;
  public vueComponent = markRaw(TextEditor);

  private lastWidth = 50;

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public x: number,
    public y: number,
    public text: string,
    public font: string,
    public size: number,
    public color: string,
    public alignment: number,
    public placeholder: boolean,
    public previewText: string
  ) {
    super(id, name, clickAction);
  }

  draw(context: CanvasRenderingContext2D): void {
    const renderText = this.placeholder ? this.previewText : this.text;
    context.font = `${this.size}px ${this.font}`;
    context.fillStyle = this.color;
    this.lastWidth = context.measureText(renderText).width;
    context.fillText(
      renderText,
      this.x - (this.alignment / 2) * this.lastWidth,
      this.y
    );
  }

  modify(newBoundingBox: BoundingBox): void {
    this.x = newBoundingBox.x + (this.alignment / 2) * this.lastWidth;
    this.y = newBoundingBox.y + this.size;
  }

  getBoundingBox() {
    return new BoundingBox(
      this.x - (this.alignment / 2) * this.lastWidth,
      this.y - this.size,
      this.lastWidth,
      this.size
    );
  }

  toDataObj() {
    return {
      type: Text.displayName,
      x: this.x,
      y: this.y,
      text: this.text,
      font: this.font,
      size: this.size,
      color: this.color,
      alignment: this.alignment,
      placeholder: this.placeholder,
      previewText: this.previewText
    };
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    return new Text(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      jsonObj.x,
      jsonObj.y,
      jsonObj.text,
      jsonObj.font,
      jsonObj.size,
      jsonObj.color,
      jsonObj.alignment,
      jsonObj.placeholder,
      jsonObj.previewText
    );
  }

  static generator() {
    return new Text(
      "-",
      Text.displayName,
      [],
      10,
      10,
      "Text",
      "VT323",
      20,
      "#67809f",
      0,
      false,
      "123"
    );
  }
}
