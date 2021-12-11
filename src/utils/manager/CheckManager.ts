import { Component as VueComponent } from "vue";

import { ItemCheck } from "../checks/ItemCheck";
import { MoneyCheck } from "../checks/MoneyCheck";
import { PermissionCheck } from "../checks/PermissionCheck";
import { VisibilityCheck } from "../checks/VisibilityCheck";
import { Check } from "../checks/Check";
import { JsonObject } from "./ComponentManager";
import { PlaceholderCheck } from "../checks/PlaceholderCheck";
import { StandbyCheck } from "../checks/StandbyCheck";
import { ListNextCheck } from "../checks/ListNextCheck";

interface CheckMeta {
  generator: () => Check;
  fromJson: (jsonObj: JsonObject) => Check;
  id: string;
  component: VueComponent;
}

export const checkIDs = [
  ItemCheck.id,
  MoneyCheck.id,
  PermissionCheck.id,
  VisibilityCheck.id,
  PlaceholderCheck.id,
  ListNextCheck.id,
  StandbyCheck.id
];

export const checks: { [key: string]: CheckMeta } = {
  [ItemCheck.id]: ItemCheck,
  [MoneyCheck.id]: MoneyCheck,
  [PermissionCheck.id]: PermissionCheck,
  [VisibilityCheck.id]: VisibilityCheck,
  [PlaceholderCheck.id]: PlaceholderCheck,
  [ListNextCheck.id]: ListNextCheck,
  [StandbyCheck.id]: StandbyCheck
};

export function checkFromJson(jsonObj: JsonObject, type: string): Check {
  return checks[type].fromJson(jsonObj);
}
