import { CheckAction } from "./CheckAction";
import { JsonObject } from "../ComponentManager";
import { Action } from "../Action";
import { actionsFromJson } from "../ActionManager";

export class VisibilityCheck extends CheckAction {
  public static id = "Visiblity Check";
  public id = VisibilityCheck.id;

  constructor(public actions: Action[], public component: string) {
    super(actions);
  }

  static fromJson(jsonObj: JsonObject) {
    return new VisibilityCheck(
      actionsFromJson(jsonObj.actions),
      jsonObj.component
    );
  }

  toCheckDataObj(): JsonObject {
    return {
      component: this.component
    };
  }
}
