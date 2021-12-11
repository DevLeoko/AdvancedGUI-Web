import { Rect } from "./components/Rect";
import { RemoteImage } from "./components/RemoteImage";
import { GIF } from "./components/GIF";
import { GroupComponent } from "./components/GroupComponent";
import { ClickAnimation } from "./components/ClickAnimation";
import { CheckComponent } from "./components/CheckComponent";
import { TextInput } from "./components/TextInput";
import { Template } from "./components/Template";
import { Replica } from "./components/Replica";
import { View } from "./components/View";
import { Dummy } from "./components/Dummy";
import { Text } from "./components/Text";
import { Hover } from "./components/Hover";
import { Image } from "./components/Image";
import { Component, JsonConverter } from "./components/Component";
import { List } from "./components/List";

export interface ComponentMeta {
  generator: () => Component;
  fromJson: JsonConverter;
  childComponentProps?: string[];
  displayName: string;
  icon: string;
}

export const componentNames = [
  Rect.displayName,
  Text.displayName,
  Image.displayName,
  RemoteImage.displayName,
  GIF.displayName,
  GroupComponent.displayName,
  Hover.displayName,
  ClickAnimation.displayName,
  CheckComponent.displayName,
  TextInput.displayName,
  View.displayName,
  Template.displayName,
  Replica.displayName,
  List.displayName,
  Dummy.displayName
];

export const componentInfo: {
  [key: string]: ComponentMeta;
} = {
  [Rect.displayName]: Rect,
  [Text.displayName]: Text,
  [Image.displayName]: Image,
  [RemoteImage.displayName]: RemoteImage,
  [GIF.displayName]: GIF,
  [GroupComponent.displayName]: GroupComponent,
  [Hover.displayName]: Hover,
  [ClickAnimation.displayName]: ClickAnimation,
  [CheckComponent.displayName]: CheckComponent,
  [TextInput.displayName]: TextInput,
  [View.displayName]: View,
  [Template.displayName]: Template,
  [Replica.displayName]: Replica,
  [List.displayName]: List,
  [Dummy.displayName]: Dummy
};
