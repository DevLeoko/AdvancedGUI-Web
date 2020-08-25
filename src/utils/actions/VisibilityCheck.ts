import { CheckAction } from "./CheckAction";
import { JsonObject } from "../ComponentManager";
import { Action } from "../Action";
import { actionsFromJson } from "../ActionManager";

export class VisibilityCheck extends CheckAction {
  public static id = "Visibility Check";
  public id = VisibilityCheck.id;

  constructor(
    public actions: Action[],
    public targetId: string,
    public expanded: boolean
  ) {
    super(actions, expanded);
  }

  static fromJson(jsonObj: JsonObject) {
    return new VisibilityCheck(
      actionsFromJson(jsonObj.actions),
      jsonObj.targetId,
      jsonObj.expanded
    );
  }

  toCheckDataObj(): JsonObject {
    return {
      targetId: this.targetId
    };
  }
}
