import { extend } from "vue/types/umd";
import { CheckAction } from "./CheckAction";
import { JsonObject } from "../ComponentManager";
import { Action } from "../Action";
import { actionsFromJson } from "../ActionManager";

export class PermissionCheck extends CheckAction {
  public id = "Permission";

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
    throw new Error("Method not implemented.");
  }
}
