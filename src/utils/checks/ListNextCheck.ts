import { JsonObject } from "../manager/ComponentManager";
import { Check } from "./Check";

import ListNextCheckEditor from "@/components/actionEditors/checks/ListNextCheckEditor.vue";
import { markRaw } from "vue";

export class ListNextCheck implements Check {
  public static id = "List next Check";
  public static component = markRaw(ListNextCheckEditor);
  public name = ListNextCheck.id;

  constructor(public targetId: string, public forward: boolean) {}

  static fromJson(jsonObj: JsonObject) {
    return new ListNextCheck(jsonObj.targetId, jsonObj.forward);
  }

  toCheckDataObj(): JsonObject {
    return {
      targetId: this.targetId,
      forward: this.forward
    };
  }

  static generator() {
    return new ListNextCheck("", true);
  }
}
