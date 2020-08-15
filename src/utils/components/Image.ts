import { BoundingBox } from "../BoundingBox";
import ImageEditor from "@/components/editors/ImageEditor.vue";
import { Rectangular } from "./Rectangular";
import { Action } from "../Action";
import { JsonObject } from "../ComponentManager";
import { images } from "../ImageManager";

export class Image extends Rectangular {
  public static displayName = "Image";
  public static icon = "image";
  public displayName = Image.displayName;
  public icon = Image.icon;
  public vueComponent = ImageEditor;
  public resizeable = true;

  constructor(
    public id: string,
    public clickAction: Action[],
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public image: string,
    public keepImageRatio: boolean
  ) {
    super(id, clickAction, x, y, width, height);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(
      images[this.image].data,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  modify(newBoundingBox: BoundingBox, singleAxisAction = false): void {
    this.x = newBoundingBox.x;
    this.y = newBoundingBox.y;

    if (this.keepImageRatio) {
      const ratio = images[this.image].ratio;

      const w1 = newBoundingBox.height * ratio;
      const h1 = newBoundingBox.width / ratio;

      // if (singleAxisAction) {
      //   if (this.width != newBoundingBox.width) {
      //     this.width = newBoundingBox.width;
      //     this.height = h1;
      //     console.log("uff");
      //   } else {
      //     this.width = w1;
      //     this.height = newBoundingBox.height;
      //   }
      // } else {
      this.width = Math.min(newBoundingBox.width, w1);
      this.height = Math.min(newBoundingBox.height, h1);
    } else {
      this.width = newBoundingBox.width;
      this.height = newBoundingBox.height;
    }
  }

  setImage(nImage: string) {
    if (this.keepImageRatio) {
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

  toJsonObj() {
    return {
      type: Image.displayName,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      image: this.image,
      keepImageRatio: this.keepImageRatio
    };
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    return new Image(
      jsonObj.id,
      clickAction,
      jsonObj.x,
      jsonObj.y,
      jsonObj.width,
      jsonObj.height,
      jsonObj.image,
      jsonObj.keepImageRatio
    );
  }
}
