import { Action } from "../Action";
import { JsonObject } from "../ComponentManager";

export class CommandAction extends Action {
  public static id = "Command";
  public static icon = "play_circle_outline";
  public id = CommandAction.id;
  public icon = CommandAction.icon;

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
