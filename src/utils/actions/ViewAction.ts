import { Action } from "../Action";
import { JsonObject } from "../ComponentManager";

export class ViewAction extends Action {
  public static id = "View";
  public id = ViewAction.id;

  constructor(public target: string, public activate: string) {
    super();
  }

  static fromJson(jsonObj: JsonObject) {
    return new ViewAction(jsonObj.target, jsonObj.activate);
  }

  toDataObj() {
    return {
      target: this.target,
      activate: this.activate
    };
  }
}
