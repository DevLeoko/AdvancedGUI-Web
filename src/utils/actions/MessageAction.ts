import { Action } from "./Action";
import { JsonObject } from "../manager/ComponentManager";

export class MessageAction extends Action {
  public static id = "Message";
  public id = MessageAction.id;

  constructor(public message: string) {
    super();
  }

  static fromJson(jsonObj: JsonObject) {
    return new MessageAction(jsonObj.message);
  }

  toDataObj() {
    return {
      message: this.message
    };
  }
}
