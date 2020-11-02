import { JsonObject } from "../manager/ComponentManager";
import { Check } from "./Check";

import PlaceholderCheckEditor from "@/components/actionEditors/checks/PlaceholderCheckEditor.vue";
import { markRaw } from "vue";

export class PlaceholderCheck implements Check {
  public static id = "Placeholder Check";
  public static component = markRaw(PlaceholderCheckEditor);
  public name = PlaceholderCheck.id;

  constructor(public placeholder: string, public value: string) {}

  static fromJson(jsonObj: JsonObject) {
    return new PlaceholderCheck(jsonObj.placeholder, jsonObj.value);
  }

  toCheckDataObj(): JsonObject {
    return {
      placeholder: this.placeholder,
      value: this.value
    };
  }

  static generator() {
    return new PlaceholderCheck("%armor_has_chestplate%", "true");
  }
}
