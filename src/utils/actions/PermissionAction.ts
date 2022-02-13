import { Action } from "./Action";
import { JsonObject } from "../manager/ComponentManager";

export class PermissionAction extends Action {
  public static id = "Permission";
  public id = PermissionAction.id;

  constructor(public permission: string, public add: boolean) {
    super();
  }

  static fromJson(jsonObj: JsonObject) {
    return new PermissionAction(jsonObj.permission, jsonObj.add);
  }

  toDataObj() {
    return {
      permission: this.permission,
      add: this.add
    };
  }
}
