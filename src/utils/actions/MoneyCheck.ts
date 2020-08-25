import { CheckAction } from "./CheckAction";
import { JsonObject } from "../ComponentManager";
import { Action } from "../Action";
import { actionsFromJson } from "../ActionManager";

export class MoneyCheck extends CheckAction {
  public static id = "Money Check";
  public id = MoneyCheck.id;

  constructor(
    public actions: Action[],
    public amount: number,
    public expanded: boolean
  ) {
    super(actions, expanded);
  }

  static fromJson(jsonObj: JsonObject) {
    return new MoneyCheck(
      actionsFromJson(jsonObj.actions),
      jsonObj.amount,
      jsonObj.expanded
    );
  }

  toCheckDataObj(): JsonObject {
    return {
      amount: this.amount
    };
  }
}
