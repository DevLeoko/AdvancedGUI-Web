import { Action } from "./Action";
import { JsonObject } from "./ComponentManager";
import { CommandAction } from "./actions/CommandAction";
import { ListAction } from "./actions/ListAction";
import { PermissionCheck } from "./actions/PermissionCheck";

interface ActionMeta {
  gernerator: () => Action;
  fromJson: (jsonObj: JsonObject) => Action;
  icon: string;
}

export const actions: { [key: string]: ActionMeta } = {};

export function setup() {
  actions[CommandAction.prototype.id] = {
    gernerator: () => new CommandAction("heal %player%", true),
    fromJson: CommandAction.fromJson,
    icon: CommandAction.prototype.icon
  };

  actions[ListAction.prototype.id] = {
    gernerator: () => new ListAction([]),
    fromJson: ListAction.fromJson,
    icon: ListAction.prototype.icon
  };

  actions[PermissionCheck.prototype.id] = {
    gernerator: () => new PermissionCheck([], "ag.group.premium"),
    fromJson: PermissionCheck.fromJson,
    icon: PermissionCheck.prototype.icon
  };
}

export function actionFromJson(jsonObj: JsonObject): Action {
  return actions[jsonObj.id].fromJson(jsonObj);
}

export function actionsFromJson(jsonObj: JsonObject): Action[] {
  return (jsonObj as JsonObject[]).map(obj => actionFromJson(obj));
}
