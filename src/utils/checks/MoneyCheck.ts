import { JsonObject } from "../manager/ComponentManager";
import { Check } from "./Check";

import MoneyCheckEditor from "@/components/actionEditors/checks/MoneyCheckEditor.vue";
import { markRaw } from "vue";

export class MoneyCheck implements Check {
  public static id = "Money Check";
  public static component = markRaw(MoneyCheckEditor);
  public name = MoneyCheck.id;

  constructor(public amount: number) {}

  static fromJson(jsonObj: JsonObject) {
    return new MoneyCheck(jsonObj.amount);
  }

  toCheckDataObj(): JsonObject {
    return {
      amount: this.amount
    };
  }

  static generator() {
    return new MoneyCheck(30);
  }
}
