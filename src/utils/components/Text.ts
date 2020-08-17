import { BoundingBox } from "../BoundingBox";
import TextEditor from "@/components/editors/TextEditor.vue";
import { Action } from "../Action";
import { JsonObject, ComponentType } from "../ComponentManager";
import { Component } from "../Component";

export class Text extends Component {
  public static displayName: ComponentType = "Text";
  public static icon = "text_fields";
  public displayName = Text.displayName;
  public icon = Text.icon;
  public vueComponent = TextEditor;

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
    public placeholder: boolean
  ) {
    super(id, name, clickAction);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.font = `${this.size}px ${this.font}`;
    context.fillStyle = this.color;
    context.fillText(this.text, this.x, this.y);
    this.lastWidth = context.measureText(this.text).width;
  }

  modify(newBoundingBox: BoundingBox): void {
    this.x = newBoundingBox.x;
    this.y = newBoundingBox.y + this.size;
  }

  getBoundingBox() {
    return new BoundingBox(
      this.x,
      this.y - this.size,
      this.lastWidth,
      this.size
    );
  }

  toJsonObj() {
    return {
      type: Text.displayName,
      x: this.x,
      y: this.y,
      text: this.text,
      font: this.font,
      size: this.size,
      color: this.color,
      placeholder: this.placeholder
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
      jsonObj.placeholder
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
      false
    );
  }
}
