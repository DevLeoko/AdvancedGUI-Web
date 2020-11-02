import { JsonObject } from "../manager/ComponentManager";
import { Check } from "./Check";

import ItemCheckEditor from "@/components/actionEditors/checks/ItemCheckEditor.vue";
import { markRaw } from "vue";

export class ItemCheck implements Check {
  public static id = "Item Check";
  public static component = markRaw(ItemCheckEditor);
  public name = ItemCheck.id;

  constructor(public amount: number, public itemName: string) {}

  static fromJson(jsonObj: JsonObject) {
    return new ItemCheck(jsonObj.amount, jsonObj.itemName);
  }

  toCheckDataObj(): JsonObject {
    return {
      amount: this.amount,
      itemName: this.itemName
    };
  }

  static generator() {
    return new ItemCheck(3, "gold_ingot");
  }
}
