import { BoundingBox } from "../BoundingBox";
import Editor from "@/components/editors/EmptyEditor.vue";
import { Action } from "../actions/Action";
import { JsonObject } from "../manager/ComponentManager";
import { Component, ComponentType } from "./Component";
import { markRaw } from "vue";

export class Dummy extends Component {
  public static displayName: ComponentType = "Dummy";
  public static icon = "code";
  public displayName = Dummy.displayName;
  public icon = Dummy.icon;
  public vueComponent = markRaw(Editor);
  public actionable = false;
  public hideable = false;

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[]
  ) {
    super(id, name, clickAction);
  }

  draw() {
    // Do nothing
  }

  modify() {
    // Do nothing
  }

  getBoundingBox() {
    return BoundingBox.EMPTY;
  }

  toDataObj() {
    return {
      type: Dummy.displayName
    };
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    return new Dummy(jsonObj.id, jsonObj.name, clickAction);
  }

  static generator() {
    return new Dummy("-", Dummy.displayName, []);
  }
}
