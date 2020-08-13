import { ListItemGroup, ListItem } from "../ListItem";
import { Action } from "../Action";
import { JsonObject } from "../ComponentManager";

export abstract class CheckAction extends Action implements ListItemGroup {
  public isCheck = true;
  public itemLimit = 2;
  public icon = "fact_check";

  constructor(public actions: Action[]) {
    super();
  }
  abstract toCheckDataObj(): JsonObject;

  toDataObj() {
    return {
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
