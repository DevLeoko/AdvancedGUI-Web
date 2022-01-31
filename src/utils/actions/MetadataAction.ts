import { Action } from "./Action";
import { JsonObject } from "../manager/ComponentManager";

export class MetadataAction extends Action {
  public static id = "Metadata";
  public id = MetadataAction.id;

  constructor(public key: string, public value?: string) {
    super();
  }

  static fromJson(jsonObj: JsonObject) {
    return new MetadataAction(jsonObj.key, jsonObj.value);
  }

  toDataObj() {
    return {
      key: this.key,
      value: this.value
    };
  }
}
