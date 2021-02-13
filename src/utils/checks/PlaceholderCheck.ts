import { JsonObject } from "../manager/ComponentManager";
import { Check } from "./Check";

import PlaceholderCheckEditor from "@/components/actionEditors/checks/PlaceholderCheckEditor.vue";
import { markRaw } from "vue";

export enum ComparisonType {
  STRING = -1,
  LESS = 0,
  LESS_EQ = 1,
  EQUAL = 2,
  GREATER_EQ = 3,
  GREATER = 4
}

export class PlaceholderCheck implements Check {
  public static id = "Placeholder Check";
  public static component = markRaw(PlaceholderCheckEditor);
  public name = PlaceholderCheck.id;

  constructor(
    public placeholder: string,
    public compType: ComparisonType,
    public value: string
  ) {}

  static fromJson(jsonObj: JsonObject) {
    return new PlaceholderCheck(
      jsonObj.placeholder,
      jsonObj.compType,
      jsonObj.value
    );
  }

  toCheckDataObj(): JsonObject {
    return {
      placeholder: this.placeholder,
      compType: this.compType,
      value: this.value
    };
  }

  static generator() {
    return new PlaceholderCheck(
      "%armor_has_chestplate%",
      ComparisonType.STRING,
      "true"
    );
  }
}
