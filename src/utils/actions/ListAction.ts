import { Action } from "../Action";
import { JsonObject } from "../ComponentManager";
import { ListItemGroup } from "../ListItem";
import { actionsFromJson } from "../ActionManager";

export class ListAction extends Action implements ListItemGroup {
  public static id = "List";
  public static icon = "receipt_long";
  public id = ListAction.id;
  public icon = ListAction.icon;

  constructor(public actions: Action[], public expanded: boolean) {
    super();
  }

  static fromJson(jsonObj: JsonObject) {
    return new ListAction(actionsFromJson(jsonObj.actions), jsonObj.expanded);
  }

  toDataObj() {
    return {
      actions: this.actions.map(action => action.toJsonObj()),
      expanded: this.expanded
    };
  }

  getItems() {
    return this.actions;
  }

  isGroup() {
    return true;
  }
}
