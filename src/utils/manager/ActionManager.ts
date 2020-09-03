import { Action } from "../actions/Action";
import { JsonObject } from "./ComponentManager";
import { CommandAction } from "../actions/CommandAction";
import { ListAction } from "../actions/ListAction";
import { VueConstructor } from "vue";

import CommandEditor from "@/components/actionEditors/CommandEditor.vue";
import MessageEditor from "@/components/actionEditors/MessageEditor.vue";
import VisibilityEditor from "@/components/actionEditors/VisibilityEditor.vue";
import ViewEditor from "@/components/actionEditors/ViewEditor.vue";
import { MessageAction } from "../actions/MessageAction";
import { VisibilityAction } from "../actions/VisibilityAction";
import { Component } from "../components/Component";
import { ViewAction } from "../actions/ViewAction";
import { checks } from "./CheckManager";
import { CheckAction } from "../actions/CheckAction";

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

  for (const name in checks) {
    const check = checks[name];
    actions[name] = {
      generator: () => {
        return new CheckAction(check.generator(), [], true);
      },
      fromJson: CheckAction.fromJson,
      icon: CheckAction.icon,
      component: check.component
    };
  }
}

export function actionFromJson(jsonObj: JsonObject): Action {
  return actions[jsonObj.id].fromJson(jsonObj);
}

export function actionsFromJson(jsonObj: JsonObject): Action[] {
  return (jsonObj as JsonObject[]).map(obj => actionFromJson(obj));
}
