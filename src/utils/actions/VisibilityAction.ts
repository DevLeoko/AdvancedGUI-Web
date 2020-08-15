import { Action } from "../Action";
import { JsonObject } from "../ComponentManager";

export class VisiblityAction extends Action {
  public static id = "Visiblity";
  public id = VisiblityAction.id;

  constructor(public target: string, public visible: boolean) {
    super();
  }

  static fromJson(jsonObj: JsonObject) {
    return new VisiblityAction(jsonObj.target, jsonObj.visible);
  }

  toDataObj() {
    return {
      target: this.target,
      visible: this.visible
    };
  }
}
