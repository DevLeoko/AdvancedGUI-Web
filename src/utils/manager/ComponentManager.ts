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
  fonts: Font[];
  width: number;
  height: number;
  images: {
    name: string;
    data: string;
  }[];
  componentTree: GroupComponent;
}

export type JsonConverter = (
  jsonObj: JsonObject,
  clickAction: Action[],
  reassignIDs: boolean
) => Component;

export interface ComponentMeta {
  generator: () => Component;
  fromJson: JsonConverter;
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

function getUniqueID() {
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

export function componentFromJson(
  jsonObj: JsonObject,
  reassignIDs = false
): Component | null {
  if (jsonObj.type) {
    const actions = actionsFromJson(jsonObj.action);
    if (reassignIDs) jsonObj.id = getUniqueID();
    const component = componentInfo[jsonObj.type].fromJson(
      jsonObj,
      actions,
      reassignIDs
    );
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
  if (component.id == "-") component.id = getUniqueID();
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
