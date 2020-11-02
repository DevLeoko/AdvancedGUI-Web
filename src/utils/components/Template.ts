import Editor from "@/components/editors/TemplateEditor.vue";
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
import { markRaw } from "vue";

export class Template extends GroupComponent {
  public static inputTransformer = (
    ev: KeyboardEvent,
    val: string | number
  ) => {
    if (ev.key == "#") {
      const input = ev.target as HTMLInputElement;
      if (input.type != "text") {
        input.type = "text";
        input.value = val.toString();
        ev.preventDefault();
      }
    }
  };

  public static displayName: ComponentType = "Template";
  public static icon = "book";
  public displayName = Template.displayName;
  public icon = Template.icon;
  public vueComponent = markRaw(Editor);
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
    forUsage = false,
    data = this.defaultData,
    position = null as { x: number; y: number } | null,
    id = this.id
  ): GroupComponent {
    const idGenerator = (compId: string) => `${compId}#${id}`;

    const newComps = this.components
      .map(comp => {
        let json = comp.toJson(forUsage);
        for (const entry of data) {
          const value = entry.value;
          if (typeof value == "number") {
            json = json.replace(
              new RegExp(`"#${entry.name}"`, "g"),
              value.toString()
            );
          } else {
            json = json.replace(new RegExp(`#${entry.name}`, "g"), value);
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
    this.transpileToGroup(true).draw(context);
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
    return new Template("-", Template.displayName, [], [], true, [
      { name: "mainColor", value: "#26e686" },
      { name: "price", value: 12 }
    ]);
  }
}
