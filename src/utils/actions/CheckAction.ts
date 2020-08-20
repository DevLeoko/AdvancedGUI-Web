import { ListItemGroup } from "../ListItem";
import { Action } from "../Action";
import { JsonObject } from "../ComponentManager";

export abstract class CheckAction extends Action implements ListItemGroup {
  public itemLimit = 2;
  public static icon = "fact_check";
  public icon = CheckAction.icon;
  public itemClasses = ["posAction", "negAction"];

  constructor(public actions: Action[]) {
    super();
  }
  abstract toCheckDataObj(): JsonObject;

  toDataObj() {
    return {
      check: true,
      actions: this.actions.map(action => action.toJsonObj()),
      ...this.toCheckDataObj()
    };
  }

  getItems() {
    return this.actions;
  }

  isGroup() {
    return true;
  }
}
