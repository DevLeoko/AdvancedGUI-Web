import { Component } from "./Component";
import { Action } from "./Action";
import { Rect } from "./components/Rect";
import { GroupComponent } from "./components/GroupComponent";
import { Text } from "./components/Text";
import { Image } from "./components/Image";
import { Hover } from "./components/Hover";
import { View } from "./components/View";

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

export function componentFromJson(
  jsonObj: JsonObject,
  correctIDs = false //TODO use this
): Component | null {
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
  componentInfo[Hover.displayName] = Hover;
  componentInfo[View.displayName] = View;
  componentInfo[Text.displayName] = Text;
  componentInfo[Image.displayName] = Image;

  converters[Rect.displayName] = Rect.fromJson;
  converters[GroupComponent.displayName] = GroupComponent.fromJson;
  converters[Hover.displayName] = Hover.fromJson;
  converters[View.displayName] = View.fromJson;
  converters[Text.displayName] = Text.fromJson;
  converters[Image.displayName] = Image.fromJson;

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
  generators[Hover.displayName] = () =>
    new Hover(ensureUniqueness(Hover.displayName), [], []);
  generators[View.displayName] = () =>
    new View(ensureUniqueness(View.displayName), [], []);

  generators[Text.displayName] = () =>
    new Text(
      ensureUniqueness(Text.displayName),
      [],
      10,
      10,
      "Text",
      "Verdana",
      20,
      "#67809f"
    );

  generators[Image.displayName] = () =>
    new Image(
      ensureUniqueness(Image.displayName),
      [],
      10,
      10,
      50,
      50,
      "Play",
      true
    );
}
