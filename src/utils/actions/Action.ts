import { JsonObject } from "../manager/ComponentManager";
import { ListItem, ListItemGroup } from "../ListItem";
import { actionFromJson } from "../manager/ActionManager";
import { CheckAction } from "./CheckAction";

export abstract class Action implements ListItem {
  public static icon = "play_circle_outline";
  public icon = Action.icon;
  public hideable = false;

  abstract toDataObj(): JsonObject;
  abstract get id(): string;

  get name() {
    return this.id;
  }

  toJsonObj() {
    return {
      id: this.id,
      ...this.toDataObj()
    };
  }

  toJson() {
    return JSON.stringify(this.toJsonObj());
  }

  isGroup(): this is ListItemGroup<this> {
    return false;
  }

  duplicate() {
    return actionFromJson(this.toJsonObj());
  }

  delete() {
    // Action objects are generally not tracked
  }

  public isCheck(): this is CheckAction {
    return false;
  }
}
