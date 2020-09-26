import { Action } from "./Action";
import { JsonObject } from "../manager/ComponentManager";

export class CommandAction extends Action {
  public static id = "Command";
  public id = CommandAction.id;

  constructor(
    public command: string,
    public asConsole: boolean,
    public asOperator: boolean
  ) {
    super();
  }

  static fromJson(jsonObj: JsonObject) {
    return new CommandAction(
      jsonObj.command,
      jsonObj.asConsole,
      jsonObj.asOperator
    );
  }

  toDataObj() {
    return {
      command: this.command,
      asConsole: this.asConsole,
      asOperator: this.asOperator
    };
  }
}
