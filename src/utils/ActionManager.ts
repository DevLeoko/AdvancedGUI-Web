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
  actions[CommandAction.id] = {
    gernerator: () => new CommandAction("heal %player%", true),
    fromJson: CommandAction.fromJson,
    icon: CommandAction.icon
  };

  actions[ListAction.id] = {
    gernerator: () => new ListAction([]),
    fromJson: ListAction.fromJson,
    icon: ListAction.icon
  };

  actions[PermissionCheck.id] = {
    gernerator: () => new PermissionCheck([], "ag.group.premium"),
    fromJson: PermissionCheck.fromJson,
    icon: PermissionCheck.icon
  };
}

export function actionFromJson(jsonObj: JsonObject): Action {
  return actions[jsonObj.id].fromJson(jsonObj);
}

export function actionsFromJson(jsonObj: JsonObject): Action[] {
  return (jsonObj as JsonObject[]).map(obj => actionFromJson(obj));
}
