import { Action } from "./Action";
import { JsonObject } from "../manager/ComponentManager";

export class VisibilityAction extends Action {
  public static id = "Visibility";
  public id = VisibilityAction.id;

  constructor(public targetId: string, public visibility: boolean) {
    super();
  }

  static fromJson(jsonObj: JsonObject) {
    return new VisibilityAction(jsonObj.targetId, jsonObj.visibility);
  }

  toDataObj() {
    return {
      targetId: this.targetId,
      visibility: this.visibility
    };
  }
}
