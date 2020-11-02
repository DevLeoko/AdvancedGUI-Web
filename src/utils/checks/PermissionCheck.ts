import { JsonObject } from "../manager/ComponentManager";
import { Check } from "./Check";

import PermissionCheckEditor from "@/components/actionEditors/checks/PermissionCheckEditor.vue";
import { markRaw } from "vue";

export class PermissionCheck implements Check {
  public static id = "Permission Check";
  public static component = markRaw(PermissionCheckEditor);
  public name = PermissionCheck.id;

  constructor(public permission: string) {}

  static fromJson(jsonObj: JsonObject) {
    return new PermissionCheck(jsonObj.permission);
  }

  toCheckDataObj(): JsonObject {
    return {
      permission: this.permission
    };
  }

  static generator() {
    return new PermissionCheck("ag.group.premium");
  }
}
