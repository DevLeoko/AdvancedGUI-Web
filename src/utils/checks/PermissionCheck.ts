import { CheckAction } from "../actions/CheckAction";
import { JsonObject } from "../ComponentManager";
import { Action } from "../Action";
import { actionsFromJson } from "../ActionManager";

export class PermissionCheck extends CheckAction {
  public static id = "Permission Check";
  public id = PermissionCheck.id;

  constructor(
    public actions: Action[],
    public permission: string,
    public expanded: boolean
  ) {
    super(actions, expanded);
  }

  static fromJson(jsonObj: JsonObject) {
    return new PermissionCheck(
      actionsFromJson(jsonObj.actions),
      jsonObj.permission,
      jsonObj.expanded
    );
  }

  toCheckDataObj(): JsonObject {
    return {
      permission: this.permission
    };
  }
}
