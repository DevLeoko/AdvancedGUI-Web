import ViewEditor from "@/components/editors/EmptyEditor.vue";
import { Component } from "./Component";
import { Action } from "../actions/Action";
import {
  JsonObject,
  ComponentType,
  TemplateData,
  componentFromJson,
  reassignIDs
} from "../manager/ComponentManager";
import { GroupComponent } from "./GroupComponent";

export class Template extends GroupComponent {
  public static displayName: ComponentType = "Template";
  public static icon = "book";
  public displayName = Template.displayName;
  public icon = Template.icon;
  public vueComponent = ViewEditor;
  public actionable = false;

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public components: Component[],
    public expanded: boolean,
    public defaultData: TemplateData
  ) {
    super(id, name, clickAction, components, expanded);
  }

  transpileToGroup(
    data = this.defaultData,
    position = null as { x: number; y: number } | null,
    id = this.id
  ): GroupComponent {
    const idGenerator = (compId: string) => `${compId}#${id}`;

    const newComps = this.components
      .map(comp => {
        const json = comp.toJson();
        for (const key of Object.keys(data)) {
          const value = data[key];
          if (typeof value == "number") {
            json.replace(new RegExp(`"#${key}"`, "g"), value.toString());
          } else {
            json.replace(new RegExp(`#${key}`, "g"), value);
          }
        }
        return json;
      })
      .map(
        json => componentFromJson(reassignIDs(JSON.parse(json), idGenerator))!
      );

    const group = new GroupComponent(id, "-", [], newComps, true);
    if (position) {
      const boundingBox = group.getBoundingBox();

      boundingBox.x = position.x;
      boundingBox.y = position.y;

      group.modify(boundingBox);
    }

    return group;
  }

  draw(context: CanvasRenderingContext2D): void {
    this.transpileToGroup().draw(context);
  }

  toDataObj(forUsage: boolean) {
    if (!forUsage) {
      return {
        defaultData: this.defaultData,
        ...super.toDataObj()
      };
    } else {
      return this.transpileToGroup().toDataObj(forUsage);
    }
  }

  toExportJson() {
    return this.transpileToGroup().toJson(true);
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    const comps: Component[] = GroupComponent.componentsFromJson(
      jsonObj.components
    );
    return new Template(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      comps,
      jsonObj.expanded,
      jsonObj.defaultData
    );
  }

  static generator() {
    return new Template("-", Template.displayName, [], [], true, {
      mainColor: "#26e686",
      price: 12
    });
  }
}
