/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExportData } from "./ComponentManager";
import { Component } from "../components/Component";
import { Action } from "../actions/Action";
import { Text } from "../components/Text";

export const VERSION = "1.0.2";

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

export function migrate(data: ExportData): ExportData {
  let oldVersion = data.version || "1.0.0";

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

  return data;
}
