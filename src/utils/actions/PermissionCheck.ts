import { CheckAction } from "./CheckAction";
import { JsonObject } from "../ComponentManager";
import { Action } from "../Action";
import { actionsFromJson } from "../ActionManager";

export class PermissionCheck extends CheckAction {
  public static id = "Permission";
  public id = PermissionCheck.id;

  constructor(public actions: Action[], public permission: string) {
    super(actions);
  }

  static fromJson(jsonObj: JsonObject) {
    return new PermissionCheck(
      actionsFromJson(jsonObj.actions),
      jsonObj.permission
    );
  }

  toCheckDataObj(): JsonObject {
    return {
      permission: this.permission
    };
  }
}
