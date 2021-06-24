/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from "../components/Component";
import { Action } from "../actions/Action";
import { Text } from "../components/Text";
import { Hover } from "../components/Hover";
import { View } from "../components/View";
import { CommandAction } from "../actions/CommandAction";
import { Image } from "../components/Image";
import { GIF } from "../components/GIF";
import { CheckComponent } from "../components/CheckComponent";
import { ComparisonType, PlaceholderCheck } from "../checks/PlaceholderCheck";
import { hexToRgba } from "../ColorUtils";
import { Rect } from "../components/Rect";
import { Project } from "../Project";

export const VERSION = "1.0.8"; // still 1.0.7

function traverseComponent(
  component: Component,
  callback: (component: Component) => void
) {
  callback(component);

  if ((component as any).components) {
    (component as any).components.forEach((comp: Component) =>
      traverseComponent(comp, callback)
    );
  }
}

function traverseAction(action: Action, callback: (component: Action) => void) {
  callback(action);

  if ((action as any).actions) {
    (action as any).actions.forEach((act: Action) =>
      traverseAction(act, callback)
    );
  }
}

function reassignObject(object: any, newObject: any) {
  Object.keys(object).forEach(key => delete object[key]);
  Object.assign(object, newObject);
}

export function migrate(data: Project): Project {
  let oldVersion = data.version || "1.0.0";
  data.version = VERSION;

  if (oldVersion == "1.0.0") {
    traverseComponent(data.componentTree, comp => {
      (comp as any).action.forEach((act: any) => {
        traverseAction(act, action => {
          if ((action as any).check) {
            reassignObject(action, {
              id: (action as any).id,
              actions: (action as any).actions,
              expanded:
                (action as any).expanded === undefined
                  ? true
                  : (action as any).expanded,
              check: {
                type: action.id,
                ...action
              }
            });
          }
        });
      });
    });
    oldVersion = "1.0.1";
  }

  if (oldVersion == "1.0.1") {
    traverseComponent(data.componentTree, comp => {
      if ((comp as any).type == Text.displayName) {
        (comp as any).previewText = "123";
      }
    });
    oldVersion = "1.0.2";
  }

  if (oldVersion == "1.0.2") {
    traverseComponent(data.componentTree, comp => {
      if ((comp as any).type == Hover.displayName) {
        (comp as any).drawHovered = false;
      }
      if ((comp as any).type == View.displayName) {
        (comp as any).drawIndex = 0;
      }
    });
    oldVersion = "1.0.3";
  }

  if (oldVersion == "1.0.3") {
    data.gifs = [];

    traverseComponent(data.componentTree, comp => {
      (comp as any).action.forEach((act: any) => {
        traverseAction(act, action => {
          if (action.id == CommandAction.id) {
            (action as any).asOperator = false;
          }
        });
      });
    });

    oldVersion = "1.0.4";
  }

  if (oldVersion == "1.0.4") {
    traverseComponent(data.componentTree, comp => {
      if (
        (comp as any).type == Image.displayName ||
        (comp as any).type == GIF.displayName
      ) {
        (comp as Image).dithering = false;
      }

      if ((comp as any).type == CheckComponent.displayName) {
        (comp as CheckComponent).drawNegative = false;
      }
    });
    oldVersion = "1.0.5";
  }

  if (oldVersion == "1.0.5") {
    traverseComponent(data.componentTree, comp => {
      if ((comp as any).type == Text.displayName) {
        (comp as Text).alignment = 0;
      }
    });
    oldVersion = "1.0.6";
  }

  if (oldVersion == "1.0.6") {
    traverseComponent(data.componentTree, comp => {
      if ((comp as any).type == Rect.displayName) {
        (comp as Rect).radius = 0;
      }

      if ((comp as any).type == CheckComponent.displayName) {
        if ((comp as any).check?.type == PlaceholderCheck.id) {
          (comp as any).check.compType = ComparisonType.STRING;
        }
      }

      (comp as any).action.forEach((act: any) => {
        traverseAction(act, action => {
          if ((action as any).check?.type == PlaceholderCheck.id) {
            (action as any).check.compType = ComparisonType.STRING;
          }
        });
      });
    });

    let jsonData = JSON.stringify(data);

    jsonData
      .match(/#[0-9A-Fa-f]{6}/g)
      ?.forEach(val => (jsonData = jsonData.replace(val, hexToRgba(val, 1))));
    jsonData = jsonData.replaceAll("transparent", "rgba(0,0,0,0)");

    data = JSON.parse(jsonData);

    oldVersion = "1.0.7";
  }

  return data;
}
