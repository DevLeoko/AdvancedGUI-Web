import { Action } from "../Action";
import { JsonObject } from "../ComponentManager";

export class CommandAction extends Action {
  public static id = "Command";
  public id = CommandAction.id;

  constructor(public command: string, public asConsole: boolean) {
    super();
  }

  static fromJson(jsonObj: JsonObject) {
    return new CommandAction(jsonObj.command, jsonObj.asConsole);
  }

  toDataObj() {
    return {
      command: this.command,
      asConsole: this.asConsole
    };
  }
}
