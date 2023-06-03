import { BoundingBox } from "../BoundingBox";
import TextEditor from "@/components/editors/TextEditor.vue";
import { Action } from "../actions/Action";
import { JsonObject } from "../manager/ComponentManager";
import { Component, ComponentType } from "./Component";
import { markRaw } from "vue";
import { getRandomColor } from "../ColorUtils";
import { ParsedText } from "../ParsedText";

export class Text extends Component {
  public static displayName: ComponentType = "Text";
  public static icon = "text_fields";
  public displayName = Text.displayName;
  public icon = Text.icon;
  public vueComponent = markRaw(TextEditor);

  private parsedText: ParsedText | null = null;

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

    if (
      this.parsedText?.rawText !== renderText ||
      this.parsedText.defaultColor !== this.color ||
      this.parsedText.state !== context.font
    ) {
      this.parsedText = new ParsedText(
        renderText,
        this.color,
        context.font,
        context
      );
    }

    const lineCount = this.parsedText.getLineCount();
    for (let l = 0; l < lineCount; l++) {
      const line = this.parsedText.getLine(l);

      let xOffset = 0;
      const lineWidth = line.reduce((sum, f) => sum + f.width, 0);
      for (const fragment of line) {
        context.fillStyle = fragment.color;
        context.fillText(
          fragment.text,
          this.x - (this.alignment / 2) * lineWidth + xOffset,
          this.y - (lineCount - 1 - l) * this.size
        );

        xOffset += fragment.width;
      }
    }
  }

  modify(newBoundingBox: BoundingBox): void {
    this.x =
      newBoundingBox.x + (this.alignment / 2) * (this.parsedText?.width || 0);
    this.y =
      newBoundingBox.y + this.size * (this.parsedText?.getLineCount() || 0);
  }

  getBoundingBox() {
    const lineCount = this.parsedText?.getLineCount() || 0;
    return new BoundingBox(
      this.x - (this.alignment / 2) * (this.parsedText?.width || 0),
      this.y - this.size * lineCount,
      this.parsedText?.width || 0,
      this.size * lineCount
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
      getRandomColor(),
      0,
      false,
      "123"
    );
  }
}
