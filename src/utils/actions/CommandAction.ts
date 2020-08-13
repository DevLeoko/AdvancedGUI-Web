import { Action } from "../Action";
import { JsonObject } from "../ComponentManager";

export class CommandAction extends Action {
  public id = "Command";
  public icon = "play_circle_outline";

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
