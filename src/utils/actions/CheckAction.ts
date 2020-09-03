import { ListItemGroup } from "../ListItem";
import { Action } from "./Action";
import { Check } from "../checks/Check";
import { JsonObject } from "../manager/ComponentManager";
import { actionsFromJson } from "../manager/ActionManager";
import { checkFromJson } from "../manager/CheckManager";

export class CheckAction extends Action implements ListItemGroup<Action> {
  public itemLimit = 2;
  public static icon = "fact_check";
  public icon = CheckAction.icon;
  public itemClasses = ["posAction", "negAction"];

  constructor(
    public check: Check,
    public actions: Action[],
    public expanded: boolean
  ) {
    super();
  }

  get id() {
    return this.check.name;
  }

  toDataObj() {
    return {
      actions: this.actions.map(action => action.toJsonObj()),
      expanded: this.expanded,
      check: {
        type: this.check.name,
        ...this.check.toCheckDataObj()
      }
    };
  }

  getItems() {
    return this.actions;
  }

  isGroup() {
    return true;
  }

  static fromJson(jsonObj: JsonObject) {
    return new CheckAction(
      checkFromJson(jsonObj.check, jsonObj.check.type),
      actionsFromJson(jsonObj.actions),
      jsonObj.expanded
    );
  }

  public isCheck(): this is CheckAction {
    return true;
  }
}
