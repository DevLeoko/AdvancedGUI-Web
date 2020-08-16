import { Component } from "./Component";
import { Action } from "./Action";
import { Rect } from "./components/Rect";
import { GroupComponent } from "./components/GroupComponent";
import { Text } from "./components/Text";
import { Image } from "./components/Image";
import { Hover } from "./components/Hover";
import { View } from "./components/View";
import Vue from "vue";

export interface JsonObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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
    // TODO: convert action
    if (reassignIDs) jsonObj.id = getUniqueID();
    const component = componentInfo[jsonObj.type].fromJson(
      jsonObj,
      [],
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
  component.id = getUniqueID();
  Vue.set(components, component.id, component);
}

export function setup() {
  componentInfo[Rect.displayName] = Rect;
  componentInfo[GroupComponent.displayName] = GroupComponent;
  componentInfo[Hover.displayName] = Hover;
  componentInfo[View.displayName] = View;
  componentInfo[Text.displayName] = Text;
  componentInfo[Image.displayName] = Image;
}
