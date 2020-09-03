import { VueConstructor } from "vue";

import { ItemCheck } from "../checks/ItemCheck";
import { MoneyCheck } from "../checks/MoneyCheck";
import { PermissionCheck } from "../checks/PermissionCheck";
import { VisibilityCheck } from "../checks/VisibilityCheck";
import { Check } from "../checks/Check";
import { JsonObject } from "./ComponentManager";

interface CheckMeta {
  generator: () => Check;
  fromJson: (jsonObj: JsonObject) => Check;
  id: string;
  component: VueConstructor;
}

export const checks: { [key: string]: CheckMeta } = {};

export function setup() {
  checks[ItemCheck.id] = ItemCheck;
  checks[MoneyCheck.id] = MoneyCheck;
  checks[PermissionCheck.id] = PermissionCheck;
  checks[VisibilityCheck.id] = VisibilityCheck;
}

export function checkFromJson(jsonObj: JsonObject, type: string): Check {
  return checks[type].fromJson(jsonObj);
}
