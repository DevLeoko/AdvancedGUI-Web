import { Component, ComponentType } from "./Component";
import { GroupComponent } from "./GroupComponent";
import Editor from "@/components/editors/ListEditor.vue";
import { markRaw } from "vue";
import { Action } from "../actions/Action";
import { BoundingBox } from "../BoundingBox";
import { transpileToGroup } from "./Template";
import { View } from "./View";
import {
  JsonObject,
  registerComponent,
  TemplateData
} from "../manager/ComponentManager";
import { Text } from "./Text";
import { Rect } from "./Rect";
import { getRandomColor, getRandomColorHex, hexToRgba } from "../ColorUtils";

export type ListEntryType = {
  name: string;
  type: "string" | "number";
}[];

export class List extends GroupComponent {
  public static displayName: ComponentType = "List";
  public static icon = "format_list_bulleted";
  public displayName = List.displayName;
  public icon = List.icon;
  public vueComponent = markRaw(Editor);
  public actionable = false;

  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public components: Component[],
    public expanded: boolean,
    public xOffset: number,
    public yOffset: number,
    public itemsAtOnce: number,
    public entryType: ListEntryType,
    public entries: { [key: string]: number | string }[],
    public drawOffset: number
  ) {
    super(id, name, clickAction, components, expanded);
  }

  get pageCount(): number {
    return Math.max(this.entries.length - this.itemsAtOnce + 1, 1);
  }

  getBoundingBox(): BoundingBox {
    const orgBox = super.getBoundingBox();

    orgBox.width += (this.itemsAtOnce - 1) * this.xOffset;
    orgBox.height += (this.itemsAtOnce - 1) * this.yOffset;

    return orgBox;
  }

  transpileToGroup(): View {
    const { x, y } = super.getBoundingBox();

    const pages: GroupComponent[] = [];
    for (let pageInd = 0; pageInd < this.pageCount; pageInd++) {
      const pageId = `${this.id}#${pageInd}`;
      const rowEntries: GroupComponent[] = [];
      for (let rowInd = 0; rowInd < this.itemsAtOnce; rowInd++) {
        const compInd = pageInd + rowInd;
        if (compInd >= this.entries.length) break;

        const entry = this.entries[compInd];
        const convEntry: TemplateData = Object.keys(entry).map(key => ({
          name: key,
          value: entry[key]
        }));

        rowEntries.push(
          transpileToGroup(
            convEntry,
            {
              x: x + this.xOffset * rowInd,
              y: y + this.yOffset * rowInd
            },
            `${pageId}#${rowInd}`,
            this.components
          )
        );
      }
      pages.push(new GroupComponent(pageId, "", [], rowEntries, false));
    }

    return new View(this.id, this.name, [], pages, false, this.drawOffset);
  }

  draw(context: CanvasRenderingContext2D): void {
    this.transpileToGroup().draw(context);
  }

  toDataObj(forUsage: boolean) {
    if (!forUsage) {
      return {
        xOffset: this.xOffset,
        yOffset: this.yOffset,
        itemsAtOnce: this.itemsAtOnce,
        entryType: this.entryType,
        entries: this.entries,
        drawOffset: this.drawOffset,
        ...super.toDataObj()
      };
    } else {
      return this.transpileToGroup().toDataObj(forUsage);
    }
  }

  static fromJson(jsonObj: JsonObject, clickAction: Action[]) {
    const comps: Component[] = GroupComponent.componentsFromJson(
      jsonObj.components
    );
    return new List(
      jsonObj.id,
      jsonObj.name,
      clickAction,
      comps,
      jsonObj.expanded,
      jsonObj.xOffset,
      jsonObj.yOffset,
      jsonObj.itemsAtOnce,
      jsonObj.entryType,
      jsonObj.entries,
      jsonObj.drawOffset
    );
  }

  static generator() {
    return new List(
      "-",
      List.displayName,
      [],
      [
        registerComponent(
          new Text(
            "-",
            Text.displayName,
            [],
            14,
            26,
            "#test",
            "VT323",
            20,
            hexToRgba("#ffffff", 1),
            0,
            false,
            "123"
          )
        ),
        registerComponent(
          new Rect("-", Rect.displayName, [], 10, 10, 130, 20, "#color", 3)
        )
      ],
      true,
      0,
      25,
      3,
      [
        { name: "color", type: "string" },
        { name: "test", type: "string" }
      ],
      [
        { color: getRandomColorHex(), test: "Test 1" },
        { color: getRandomColorHex(), test: "Test 2" },
        { color: getRandomColorHex(), test: "Test 3" },
        { color: getRandomColorHex(), test: "Test 4" }
      ],
      0
    );
  }
}
