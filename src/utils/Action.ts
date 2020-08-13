import { JsonObject } from "./ComponentManager";
import { ListItem, ListItemGroup } from "./ListItem";
import { actionFromJson } from "./ActionManager";

export abstract class Action implements ListItem {
  public hideable = false;

  abstract toDataObj(): JsonObject;
  abstract get id(): string;
  abstract get icon(): string;

  toJsonObj() {
    return {
      id: this.id,
      ...this.toDataObj()
    };
  }

  toJson() {
    return JSON.stringify(this.toJsonObj());
  }

  isGroup(): this is ListItemGroup {
    return false;
  }

  duplicate() {
    return actionFromJson(this.toJsonObj());
  }
}
