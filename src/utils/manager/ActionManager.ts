import { Action } from "../actions/Action";
import { JsonObject } from "./ComponentManager";
import { CommandAction } from "../actions/CommandAction";
import { ListAction } from "../actions/ListAction";
import { Component as VueComponent, markRaw } from "vue"; // computed also work?

import CommandEditor from "@/components/actionEditors/CommandEditor.vue";
import MessageEditor from "@/components/actionEditors/MessageEditor.vue";
import VisibilityEditor from "@/components/actionEditors/VisibilityEditor.vue";
import PermissionEditor from "@/components/actionEditors/PermissionEditor.vue";
import MoneyEditor from "@/components/actionEditors/MoneyEditor.vue";
import ViewEditor from "@/components/actionEditors/ViewEditor.vue";
import MetadataEditor from "@/components/actionEditors/MetadataEditor.vue";
import DelayEditor from "@/components/actionEditors/DelayEditor.vue";
import GifControlEditor from "@/components/actionEditors/GifControlEditor.vue";
import ListNextEditor from "@/components/actionEditors/ListNextEditor.vue";
import { MessageAction } from "../actions/MessageAction";
import { VisibilityAction } from "../actions/VisibilityAction";
import { Component } from "../components/Component";
import { ViewAction } from "../actions/ViewAction";
import { checkIDs, checks } from "./CheckManager";
import { CheckAction } from "../actions/CheckAction";
import { DelayAction } from "../actions/DelayAction";
import { GifControlAction } from "../actions/GifControlAction";
import { ListNextAction } from "../actions/ListNextAction";
import { MetadataAction } from "../actions/MetadataAction";
import { MoneyAction } from "../actions/MoneyAction";
import { PermissionAction } from "../actions/PermissionAction";

interface ActionMeta {
  generator: (comonent: Component) => Action;
  fromJson: (jsonObj: JsonObject) => Action;
  icon: string;
  component?: VueComponent;
}

export const actionIDs = [
  CommandAction.id,
  MessageAction.id,
  VisibilityAction.id,
  MoneyAction.id,
  PermissionAction.id,
  GifControlAction.id,
  ViewAction.id,
  ListNextAction.id,
  MetadataAction.id,
  DelayAction.id,
  ListAction.id,
  ...checkIDs
];

export const actions: { [key: string]: ActionMeta } = {
  [CommandAction.id]: {
    generator: () => new CommandAction("heal %player%", true, false),
    fromJson: CommandAction.fromJson,
    icon: CommandAction.icon,
    component: markRaw(CommandEditor)
  },
  [MessageAction.id]: {
    generator: () => new MessageAction("&a&lHey there!"),
    fromJson: MessageAction.fromJson,
    icon: MessageAction.icon,
    component: markRaw(MessageEditor)
  },
  [VisibilityAction.id]: {
    generator: comp => new VisibilityAction(comp.id, true),
    fromJson: VisibilityAction.fromJson,
    icon: VisibilityAction.icon,
    component: markRaw(VisibilityEditor)
  },
  [MoneyAction.id]: {
    generator: () => new MoneyAction(12),
    fromJson: MoneyAction.fromJson,
    icon: MoneyAction.icon,
    component: markRaw(MoneyEditor)
  },
  [PermissionAction.id]: {
    generator: () => new PermissionAction("essentials.fly", true),
    fromJson: PermissionAction.fromJson,
    icon: PermissionAction.icon,
    component: markRaw(PermissionEditor)
  },
  [GifControlAction.id]: {
    generator: () => new GifControlAction("", true, false),
    fromJson: GifControlAction.fromJson,
    icon: GifControlAction.icon,
    component: markRaw(GifControlEditor)
  },
  [ViewAction.id]: {
    generator: () => new ViewAction("", ""),
    fromJson: ViewAction.fromJson,
    icon: ViewAction.icon,
    component: markRaw(ViewEditor)
  },
  [MetadataAction.id]: {
    generator: () => new MetadataAction("my-variable-name", "new value :)"),
    fromJson: MetadataAction.fromJson,
    icon: MetadataAction.icon,
    component: markRaw(MetadataEditor)
  },
  [DelayAction.id]: {
    generator: () => new DelayAction(20, [], true),
    fromJson: DelayAction.fromJson,
    icon: DelayAction.icon,
    component: markRaw(DelayEditor)
  },
  [ListAction.id]: {
    generator: () => new ListAction([], true),
    fromJson: ListAction.fromJson,
    icon: ListAction.icon
  },
  [ListNextAction.id]: {
    generator: () => new ListNextAction("", true),
    fromJson: ListNextAction.fromJson,
    icon: ListNextAction.icon,
    component: markRaw(ListNextEditor)
  },

  ...Object.fromEntries(
    checkIDs.map(id => [
      id,
      {
        generator: () => {
          return new CheckAction(checks[id].generator(), [], true);
        },
        fromJson: CheckAction.fromJson,
        icon: CheckAction.icon,
        component: markRaw(checks[id].component)
      }
    ])
  )
};

export function actionFromJson(jsonObj: JsonObject): Action {
  return actions[jsonObj.id].fromJson(jsonObj);
}

export function actionsFromJson(jsonObj: JsonObject): Action[] {
  return (jsonObj as JsonObject[]).map(obj => actionFromJson(obj));
}
