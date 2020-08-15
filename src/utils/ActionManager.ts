import { Action } from "./Action";
import { JsonObject } from "./ComponentManager";
import { CommandAction } from "./actions/CommandAction";
import { ListAction } from "./actions/ListAction";
import { PermissionCheck } from "./actions/PermissionCheck";
import { VueConstructor } from "vue";

import CommandEditor from "@/components/actionEditors/CommandEditor.vue";
import MessageEditor from "@/components/actionEditors/MessageEditor.vue";
import VisibilityEditor from "@/components/actionEditors/VisibilityEditor.vue";
import ViewEditor from "@/components/actionEditors/ViewEditor.vue";
import { MessageAction } from "./actions/MessageAction";
import { VisiblityAction } from "./actions/VisibilityAction";
import { Component } from "./Component";
import { ViewAction } from "./actions/ViewAction";

interface ActionMeta {
  generator: (comonent: Component) => Action;
  fromJson: (jsonObj: JsonObject) => Action;
  icon: string;
  component?: VueConstructor;
}

export const actions: { [key: string]: ActionMeta } = {};

export function setup() {
  actions[CommandAction.id] = {
    generator: () => new CommandAction("heal %player%", true),
    fromJson: CommandAction.fromJson,
    icon: CommandAction.icon,
    component: CommandEditor
  };
  actions[MessageAction.id] = {
    generator: () => new MessageAction("&a&lHey there!"),
    fromJson: MessageAction.fromJson,
    icon: MessageAction.icon,
    component: MessageEditor
  };
  actions[VisiblityAction.id] = {
    generator: comp => new VisiblityAction(comp.id, true),
    fromJson: VisiblityAction.fromJson,
    icon: VisiblityAction.icon,
    component: VisibilityEditor
  };
  actions[ViewAction.id] = {
    generator: () => new ViewAction("", ""),
    fromJson: ViewAction.fromJson,
    icon: ViewAction.icon,
    component: ViewEditor
  };

  actions[ListAction.id] = {
    generator: () => new ListAction([]),
    fromJson: ListAction.fromJson,
    icon: ListAction.icon
  };

  actions[PermissionCheck.id] = {
    generator: () => new PermissionCheck([], "ag.group.premium"),
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
