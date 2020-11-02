import { JsonObject } from "../manager/ComponentManager";
import { Check } from "./Check";

import VisibilityCheckEditor from "@/components/actionEditors/checks/VisibilityCheckEditor.vue";
import { markRaw } from "vue";

export class VisibilityCheck implements Check {
  public static id = "Visibility Check";
  public static component = markRaw(VisibilityCheckEditor);
  public name = VisibilityCheck.id;

  constructor(public targetId: string) {}

  static fromJson(jsonObj: JsonObject) {
    return new VisibilityCheck(jsonObj.targetId);
  }

  toCheckDataObj(): JsonObject {
    return {
      targetId: this.targetId
    };
  }

  static generator() {
    return new VisibilityCheck("");
  }
}
