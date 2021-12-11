import { BoundingBox } from "../BoundingBox";
import Editor from "@/components/editors/ReplicaEditor.vue";
import { Action } from "../actions/Action";
import {
  JsonObject,
  TemplateData,
  components
} from "../manager/ComponentManager";
import { Component, ComponentType } from "./Component";
import { Template } from "./Template";
import { GroupComponent } from "./GroupComponent";
import { markRaw } from "vue";

export class Replica extends Component {
  public static displayName: ComponentType = "Replica";
  public static icon = "collections_bookmark";
  public displayName = Replica.displayName;
  public icon = Replica.icon;
  public vueComponent = markRaw(Editor);
  public actionable = false;

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public position: { x: number; y: number },
    public targetId: string,
    public templateData: TemplateData
  ) {
    super(id, name, clickAction);
  }

  private getTemplate(): Template | undefined {
    const comp = components[this.targetId];
    if (comp?.displayName != Template.displayName) return undefined;

    return comp as Template;
  }

  private getGroup(): GroupComponent | undefined {
    return this.getTemplate()?.transpileToGroup(
      this.templateData,
      this.position,
      this.id
    );
  }

  getTemplateDefaultData() {
    return this.getTemplate()?.defaultData;
  }

  draw(context: CanvasRenderingContext2D): void {
    this.getGroup()?.draw(context);
  }

  modify(newBoundingBox: BoundingBox): void {
    this.position.x = newBoundingBox.x;
    this.position.y = newBoundingBox.y;
  }

  getBoundingBox(): BoundingBox {
    return this.getGroup()?.getBoundingBox() || new BoundingBox(0, 0, 0, 0);
  }

  toDataObj(forUsage: boolean) {
    if (forUsage) {
      return this.getGroup()?.toDataObj(true) || {};
    } else {
      return {
        type: Replica.displayName,
        position: this.position,
        targetId: this.targetId,
        templateData: this.templateData
      };
    }
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    return new Replica(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      jsonObj.position,
      jsonObj.targetId,
      jsonObj.templateData
    );
  }

  static generator() {
    return new Replica("-", Replica.displayName, [], { x: 10, y: 10 }, "", []);
  }
}
