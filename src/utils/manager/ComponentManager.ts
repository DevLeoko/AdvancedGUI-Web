import { Component } from "../components/Component";
import { Action } from "../actions/Action";
import { Rect } from "../components/Rect";
import { GroupComponent } from "../components/GroupComponent";
import { Text } from "../components/Text";
import { Image } from "../components/Image";
import { Hover } from "../components/Hover";
import { View } from "../components/View";
import Vue from "vue";
import { actionsFromJson } from "./ActionManager";
import { Font } from "./FontManager";
import { CheckComponent } from "../components/CheckComponent";

export interface JsonObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type ComponentType =
  | "Rect"
  | "Group"
  | "Hover"
  | "Text"
  | "Image"
  | "View"
  | "Check";

export interface ExportData {
  type: "savepoint" | "usage";
  version: string;
  invisible: string[];
  fonts?: Font[];
  width: number;
  height: number;
  images?: {
    name: string;
    data: string;
  }[];
  componentTree: GroupComponent;
}

export type JsonConverter = (
  jsonObj: JsonObject,
  clickAction: Action[]
) => Component;

export interface ComponentMeta {
  generator: () => Component;
  fromJson: JsonConverter;
  childComponentProps?: string[];
  displayName: string;
  icon: string;
}

export const invisible: string[] = [];
export const components: {
  [key: string]: Component;
} = {};

export const componentInfo: {
  [key: string]: ComponentMeta;
} = {};

function randomString(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function generateUniqueID() {
  let id = randomString(8);
  while (components[id]) id = randomString(8);

  return id;
}

export function isInvisible(id: string) {
  return invisible.indexOf(id) != -1;
}

export function toggleVis(id: string) {
  const index = invisible.indexOf(id);

  if (index != -1) invisible.splice(index, 1);
  else invisible.push(id);
}

function _reassignIDs(
  jsonObj: JsonObject,
  idGernerator = generateUniqueID,
  idMap: { [key: string]: string }
) {
  if (jsonObj.type) {
    idMap[jsonObj.id] = generateUniqueID();
    jsonObj.id = idMap[jsonObj.id];

    const childs = componentInfo[jsonObj.type].childComponentProps;
    if (childs) {
      for (const childPorp of childs) {
        if (jsonObj[childPorp]) {
          console.log("From rec", jsonObj);

          if (Array.isArray(jsonObj[childPorp])) {
            for (const childPorpElem of jsonObj[childPorp]) {
              _reassignIDs(childPorpElem, idGernerator, idMap);
            }
          } else {
            _reassignIDs(jsonObj[childPorp], idGernerator, idMap);
          }
        }
      }
    }
  }
}

export function reassignIDs(
  jsonObj: JsonObject,
  idGernerator = generateUniqueID
): JsonObject {
  const idMap: { [key: string]: string } = {};
  console.log("From init");
  _reassignIDs(jsonObj, idGernerator, idMap);

  let json = JSON.stringify(jsonObj);
  Object.keys(idMap).forEach(
    orgId =>
      (json = json.replace(
        new RegExp(`%${orgId.toUpperCase()}%`, "g"),
        idMap[orgId]
      ))
  );

  return JSON.parse(json);
}

export function componentFromJson(
  jsonObj: JsonObject,
  reassignIDsFirst = false
): Component | null {
  if (reassignIDsFirst) jsonObj = reassignIDs(jsonObj);

  if (jsonObj.type) {
    const actions = actionsFromJson(jsonObj.action);
    const component = componentInfo[jsonObj.type].fromJson(jsonObj, actions);
    Vue.set(components, component.id, component);
    return component;
  } else {
    return null;
  }
}

export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function registerComponent(component: Component) {
  if (component.id == "-") component.id = generateUniqueID();
  Vue.set(components, component.id, component);
}

export function unregisterComponent(component: Component) {
  Vue.delete(components, component.id);
}

export function setup() {
  componentInfo[Rect.displayName] = Rect;
  componentInfo[Text.displayName] = Text;
  componentInfo[Image.displayName] = Image;
  componentInfo[GroupComponent.displayName] = GroupComponent;
  componentInfo[Hover.displayName] = Hover;
  componentInfo[CheckComponent.displayName] = CheckComponent;
  componentInfo[View.displayName] = View;
}
