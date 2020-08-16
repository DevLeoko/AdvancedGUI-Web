import { CheckAction } from "./CheckAction";
import { JsonObject } from "../ComponentManager";
import { Action } from "../Action";
import { actionsFromJson } from "../ActionManager";

export class MoneyCheck extends CheckAction {
  public static id = "Money Check";
  public id = MoneyCheck.id;

  constructor(public actions: Action[], public amount: number) {
    super(actions);
  }

  static fromJson(jsonObj: JsonObject) {
    return new MoneyCheck(actionsFromJson(jsonObj.actions), jsonObj.amount);
  }

  toCheckDataObj(): JsonObject {
    return {
      amount: this.amount
    };
  }
}
