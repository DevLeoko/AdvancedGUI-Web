import { Action } from "../actions/Action";
import { JsonObject } from "../manager/ComponentManager";
import { ComponentType } from "./Component";
import { Image } from "./Image";

export class GIF extends Image {
  public static displayName: ComponentType = "GIF";
  public static icon = "slideshow";
  public displayName = GIF.displayName;
  public icon = GIF.icon;
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
    public dithering: boolean,
    public pausedByDefault: boolean
  ) {
    super(
      id,
      name,
      clickAction,
      x,
      y,
      width,
      height,
      image,
      keepImageRatio,
      dithering
    );
  }

  toDataObj() {
    return {
      pausedByDefault: this.pausedByDefault,
      ...super.toDataObj()
    };
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    return new GIF(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      jsonObj.x,
      jsonObj.y,
      jsonObj.width,
      jsonObj.height,
      jsonObj.image,
      jsonObj.keepImageRatio,
      jsonObj.dithering,
      jsonObj.pausedByDefault
    );
  }

  static generator() {
    return new GIF(
      "-",
      GIF.displayName,
      [],
      10,
      10,
      50,
      50,
      "",
      true,
      false,
      false
    );
  }
}
