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
import VisibilityCheckEditor from "@/components/actionEditors/checks/VisibilityCheckEditor.vue";
import PermissionCheckEditor from "@/components/actionEditors/checks/PermissionCheckEditor.vue";
import MoneyCheckEditor from "@/components/actionEditors/checks/MoneyCheckEditor.vue";
import ItemCheckEditor from "@/components/actionEditors/checks/ItemCheckEditor.vue";
import { MessageAction } from "./actions/MessageAction";
import { VisibilityAction } from "./actions/VisibilityAction";
import { Component } from "./Component";
import { ViewAction } from "./actions/ViewAction";
import { ItemCheck } from "./actions/ItemCheck";
import { MoneyCheck } from "./actions/MoneyCheck";
import { VisibilityCheck } from "./actions/VisibilityCheck";

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
  actions[VisibilityAction.id] = {
    generator: comp => new VisibilityAction(comp.id, true),
    fromJson: VisibilityAction.fromJson,
    icon: VisibilityAction.icon,
    component: VisibilityEditor
  };
  actions[ViewAction.id] = {
    generator: () => new ViewAction("", ""),
    fromJson: ViewAction.fromJson,
    icon: ViewAction.icon,
    component: ViewEditor
  };

  actions[ListAction.id] = {
    generator: () => new ListAction([], true),
    fromJson: ListAction.fromJson,
    icon: ListAction.icon
  };

  actions[PermissionCheck.id] = {
    generator: () => new PermissionCheck([], "ag.group.premium", true),
    fromJson: PermissionCheck.fromJson,
    icon: PermissionCheck.icon,
    component: PermissionCheckEditor
  };
  actions[ItemCheck.id] = {
    generator: () => new ItemCheck([], 3, "gold_ingot", true),
    fromJson: ItemCheck.fromJson,
    icon: ItemCheck.icon,
    component: ItemCheckEditor
  };
  actions[MoneyCheck.id] = {
    generator: () => new MoneyCheck([], 50, true),
    fromJson: MoneyCheck.fromJson,
    icon: MoneyCheck.icon,
    component: MoneyCheckEditor
  };
  actions[VisibilityCheck.id] = {
    generator: () => new VisibilityCheck([], "", true),
    fromJson: VisibilityCheck.fromJson,
    icon: VisibilityCheck.icon,
    component: VisibilityCheckEditor
  };
}

export function actionFromJson(jsonObj: JsonObject): Action {
  return actions[jsonObj.id].fromJson(jsonObj);
}

export function actionsFromJson(jsonObj: JsonObject): Action[] {
  return (jsonObj as JsonObject[]).map(obj => actionFromJson(obj));
}
