import { CheckAction } from "./CheckAction";
import { JsonObject } from "../ComponentManager";
import { Action } from "../Action";
import { actionsFromJson } from "../ActionManager";

export class ItemCheck extends CheckAction {
  public static id = "Item Check";
  public id = ItemCheck.id;

  constructor(
    public actions: Action[],
    public amount: number,
    public itemId: number,
    public subId: number | null
  ) {
    super(actions);
  }

  static fromJson(jsonObj: JsonObject) {
    return new ItemCheck(
      actionsFromJson(jsonObj.actions),
      jsonObj.amount,
      jsonObj.itemId,
      jsonObj.subId
    );
  }

  toCheckDataObj(): JsonObject {
    return {
      amount: this.amount,
      itemId: this.itemId,
      subId: this.subId
    };
  }
}
