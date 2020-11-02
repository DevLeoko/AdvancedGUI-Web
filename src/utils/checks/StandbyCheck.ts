import { JsonObject } from "../manager/ComponentManager";
import { Check } from "./Check";

import CheckEditor from "@/components/actionEditors/checks/StandbyCheckEditor.vue";
import { markRaw } from "vue";

export class StandbyCheck implements Check {
  public static id = "Standby Check";
  public static component = markRaw(CheckEditor);
  public name = StandbyCheck.id;

  static fromJson() {
    return new StandbyCheck();
  }

  toCheckDataObj(): JsonObject {
    return {};
  }

  static generator() {
    return new StandbyCheck();
  }
}
