import { Action } from "./Action";
import { JsonObject } from "../manager/ComponentManager";

export class ViewAction extends Action {
  public static id = "View";
  public id = ViewAction.id;

  constructor(public targetId: string, public activate: string) {
    super();
  }

  static fromJson(jsonObj: JsonObject) {
    return new ViewAction(jsonObj.targetId, jsonObj.activate);
  }

  toDataObj() {
    return {
      targetId: this.targetId,
      activate: this.activate
    };
  }
}
