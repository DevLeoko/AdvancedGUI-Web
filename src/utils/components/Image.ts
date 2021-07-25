import { BoundingBox } from "../BoundingBox";
import ImageEditor from "@/components/editors/ImageEditor.vue";
import { Rectangular } from "./Rectangular";
import { Action } from "../actions/Action";
import { JsonObject } from "../manager/ComponentManager";
import { images } from "../manager/ImageManager";
import { markRaw } from "vue";
import { ComponentType } from "./Component";

export class Image extends Rectangular {
  public static displayName: ComponentType = "Image";
  public static icon = "image";
  public displayName = Image.displayName;
  public icon = Image.icon;
  public vueComponent = markRaw(ImageEditor);
  public resizeable = true;

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public image: string,
    public keepImageRatio: boolean,
    public dithering: boolean
  ) {
    super(id, name, clickAction, x, y, width, height);
  }

  draw(context: CanvasRenderingContext2D): void {
    if (images[this.image])
      context.drawImage(
        images[this.image].data,
        this.x,
        this.y,
        this.width,
        this.height
      );
    else
      context.drawImage(
        document.getElementById("broken_TAKEN_ID") as HTMLImageElement,
        Math.max(this.x, this.x + (this.width - 20) / 2),
        Math.max(this.y, this.y + (this.height - 20) / 2),
        Math.min(this.width, 20),
        Math.min(this.height, 20)
      );
  }

  modify(newBoundingBox: BoundingBox): void {
    this.x = newBoundingBox.x;
    this.y = newBoundingBox.y;

    if (this.keepImageRatio && images[this.image]) {
      const ratio = images[this.image].ratio;

      const w1 = newBoundingBox.height * ratio;
      const h1 = newBoundingBox.width / ratio;

      this.width = Math.min(newBoundingBox.width, w1);
      this.height = Math.min(newBoundingBox.height, h1);
    } else {
      this.width = newBoundingBox.width;
      this.height = newBoundingBox.height;
    }
  }

  setImage(nImage: string) {
    if (this.keepImageRatio && images[this.image] && images[nImage]) {
      const oldRatio = images[this.image].ratio;
      const ratio = images[nImage].ratio;

      if (oldRatio > ratio) {
        this.width = this.height * ratio;
      } else {
        this.height = this.width / ratio;
      }
    }
    this.image = nImage;
  }

  toDataObj() {
    return {
      type: this.displayName,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      image: this.image,
      keepImageRatio: this.keepImageRatio,
      dithering: this.dithering
    };
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    return new Image(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      jsonObj.x,
      jsonObj.y,
      jsonObj.width,
      jsonObj.height,
      jsonObj.image,
      jsonObj.keepImageRatio,
      jsonObj.dithering
    );
  }

  static generator() {
    return new Image(
      "-",
      Image.displayName,
      [],
      10,
      10,
      50,
      50,
      "Play",
      true,
      false
    );
  }
}
