import { Action } from "./Action";
import { JsonObject } from "../manager/ComponentManager";

export class GifControlAction extends Action {
  public static id = "GIF Control";
  public id = GifControlAction.id;

  constructor(
    public targetId: string,
    public pause: boolean,
    public reset: boolean
  ) {
    super();
  }

  static fromJson(jsonObj: JsonObject) {
    return new GifControlAction(jsonObj.targetId, jsonObj.pause, jsonObj.reset);
  }

  toDataObj() {
    return {
      targetId: this.targetId,
      pause: this.pause,
      reset: this.reset
    };
  }
}
