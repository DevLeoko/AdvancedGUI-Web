import { Action } from "./Action";
import { JsonObject } from "../manager/ComponentManager";
import { ListItemGroup } from "../ListItem";
import { actionsFromJson } from "../manager/ActionManager";

export class DelayAction extends Action implements ListItemGroup<Action> {
  public static id = "Delay";
  public id = DelayAction.id;
  public static icon = "timer";
  public icon = DelayAction.icon;

  constructor(
    public ticks: number,
    public children: Action[],
    public expanded: boolean
  ) {
    super();
  }

  toDataObj() {
    return {
      ticks: this.ticks,
      children: this.children.map(action => action.toJsonObj()),
      expanded: this.expanded
    };
  }

  getItems() {
    return this.children;
  }

  isGroup() {
    return true;
  }

  static fromJson(jsonObj: JsonObject) {
    return new DelayAction(
      jsonObj.ticks,
      actionsFromJson(jsonObj.children),
      jsonObj.expanded
    );
  }
}
