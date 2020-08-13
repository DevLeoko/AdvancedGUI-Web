import { Component } from "./Component";
import { Action } from "./Action";
import { Rect } from "./components/Rect";
import { GroupComponent } from "./components/GroupComponent";

export interface JsonObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type JsonConverter = (
  jsonObj: JsonObject,
  clickAction: Action[]
) => Component;

export const invisible: string[] = [];
export const converters: { [key: string]: JsonConverter } = {};
export const generators: { [key: string]: () => Component } = {};
export const componentInfo: {
  [key: string]: { displayName: string; icon: string };
} = {};

export function isInvisible(id: string) {
  return invisible.indexOf(id) != -1;
}

export function toggleVis(id: string) {
  const index = invisible.indexOf(id);

  if (index != -1) invisible.splice(index, 1);
  else invisible.push(id);
}

export function componentFromJson(jsonObj: JsonObject): Component | null {
  if (jsonObj.type) {
    // TODO: convert action
    return converters[jsonObj.type](jsonObj, []);
  } else {
    return null;
  }
}

export function ensureUniqueness(id: string) {
  return id;
  // TODO: imp logic
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function setup() {
  componentInfo[Rect.displayName] = Rect;
  componentInfo[GroupComponent.displayName] = GroupComponent;

  converters[Rect.displayName] = Rect.fromJson;
  converters[GroupComponent.displayName] = GroupComponent.fromJson;

  generators[Rect.displayName] = () =>
    new Rect(
      ensureUniqueness(Rect.displayName),
      [],
      10,
      10,
      80,
      40,
      getRandomColor()
    );
  generators[GroupComponent.displayName] = () =>
    new GroupComponent(ensureUniqueness(GroupComponent.displayName), [], []);
}
