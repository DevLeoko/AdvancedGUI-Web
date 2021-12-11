import { Component } from "../components/Component";
import { actionsFromJson } from "./ActionManager";
import { ref } from "vue";
import { ListItemGroup } from "../ListItem";
import { componentInfo } from "../ComponentMeta";

export type TemplateVariable = string;
export type TemplateData = { name: string; value: string | number }[];

export interface JsonObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const invisibleIDs = ref([] as string[]);
export const components: {
  [key: string]: Component;
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
  return invisibleIDs.value.includes(id);
}

export function toggleVis(id: string) {
  if (!id.includes("#")) {
    Object.keys(components)
      .filter(comp => comp.startsWith(`${id}#`))
      .forEach(toggleVis);
  }

  const index = invisibleIDs.value.indexOf(id);

  if (index != -1) invisibleIDs.value.splice(index, 1);
  else invisibleIDs.value.push(id);
}

function _reassignIDs(
  jsonObj: JsonObject,
  idGernerator = generateUniqueID as (oldId: string) => string,
  idMap: { [key: string]: string }
) {
  if (jsonObj.type) {
    idMap[jsonObj.id] = idGernerator(jsonObj.id);

    const childs = componentInfo[jsonObj.type].childComponentProps;
    if (childs) {
      for (const childPorp of childs) {
        if (jsonObj[childPorp]) {
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

export function traverseComponent(
  component: Component,
  callback: (component: Component) => void
) {
  callback(component);

  if (component.isGroup()) {
    component
      .getItems()
      .forEach((comp: Component) => traverseComponent(comp, callback));
  }
}

export function getParentComponent(
  component: Component
): (ListItemGroup<Component> & Component) | undefined {
  return Object.values(components).find(
    comp => comp.isGroup() && comp.getItems().some(c => c.id == component.id)
  ) as (ListItemGroup<Component> & Component) | undefined;
}

export function registerComponent(component: Component) {
  if (component.id == "-") component.setId(generateUniqueID());
  components[component.id] = component;

  if (
    component.id.includes("#") &&
    invisibleIDs.value.includes(component.id.split("#")[0]) &&
    !invisibleIDs.value.includes(component.id)
  ) {
    invisibleIDs.value.push(component.id);
  }

  return component;
}

export function unregisterComponent(component: Component) {
  delete components[component.id];

  if (!component.id.includes("#")) {
    Object.values(components)
      .filter(
        comp =>
          comp.id.startsWith(`${component.id}#`) ||
          comp.id.endsWith(`#${component.id}`)
      )
      .forEach(unregisterComponent);
  }
}

export function reassignIDs(
  jsonObj: JsonObject,
  idGernerator = generateUniqueID as (oldId: string) => string
): JsonObject {
  const idMap: { [key: string]: string } = {};
  _reassignIDs(jsonObj, idGernerator, idMap);

  let json = JSON.stringify(jsonObj);
  Object.keys(idMap).forEach(
    orgId => (json = json.replace(new RegExp(`${orgId}`, "g"), idMap[orgId]))
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
    registerComponent(component);
    return component;
  } else {
    return null;
  }
}
