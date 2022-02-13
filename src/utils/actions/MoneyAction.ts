import { Action } from "./Action";
import { JsonObject } from "../manager/ComponentManager";

export class MoneyAction extends Action {
  public static id = "Money";
  public id = MoneyAction.id;

  constructor(public amount: number) {
    super();
  }

  static fromJson(jsonObj: JsonObject) {
    return new MoneyAction(jsonObj.amount);
  }

  toDataObj() {
    return {
      amount: this.amount
    };
  }
}
