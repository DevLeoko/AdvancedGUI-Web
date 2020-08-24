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
    public itemName: string
  ) {
    super(actions);
  }

  static fromJson(jsonObj: JsonObject) {
    return new ItemCheck(
      actionsFromJson(jsonObj.actions),
      jsonObj.amount,
      jsonObj.itemName
    );
  }

  toCheckDataObj(): JsonObject {
    return {
      amount: this.amount,
      itemName: this.itemName
    };
  }
}
