import { reactive, ref } from "vue";
import { Component } from "../components/Component";
import { Selection } from "../Selection";
import {
  componentFromJson,
  JsonObject,
  registerComponent
} from "./ComponentManager";

export const componentTree = ref([] as Component[]);
export const selection = ref(null as Selection);
export const copiedComponent = ref(null as null | string);
export const pauseRendering = ref(false);
export const devMode = ref(false);
export const idWatcher = ref((() => {
  /* Do nothing */
}) as (val: string) => void);

interface Action {
  label: string;
  callback: Function;
}

export const loadingState = reactive({
  loading: false,
  error: null as string | null,
  action: null as null | Action,
  info: null as string | null
});

export function loading(val: boolean) {
  loadingState.loading = val;
}

export function info(val: string, keepLoadingState = false, action?: Action) {
  if (!keepLoadingState) loadingState.loading = false;
  loadingState.action = action || null;
  loadingState.info = val;
}

export function error(val: string, action?: Action) {
  loadingState.action = action || null;
  loadingState.loading = false;
  loadingState.error = val;
}

export function updateSelection(data: {
  value: Component | null;
  event?: Event;
}) {
  if (
    data.value &&
    data.event &&
    document.activeElement?.classList?.contains("componentIdInput")
  ) {
    // (document.activeElement as HTMLInputElement).value = data.value.id;
    idWatcher.value(data.value.id);
    data.event.preventDefault();
  } else {
    selection.value = data.value
      ? { component: data.value, action: null }
      : null;
  }
}

export function pasteComponent(target?: Component[]) {
  if (!target) {
    target = componentTree.value;
  }

  if (copiedComponent.value) {
    const nComp = componentFromJson(JSON.parse(copiedComponent.value), true)!;

    target.splice(0, 0, nComp);
    updateSelection({ value: nComp });
  }
}

export function addJsonComponentsToRoot(
  components: JsonObject[],
  reassignIDs: boolean
) {
  components.forEach(componentData => {
    const component = componentFromJson(componentData, reassignIDs);

    if (component) {
      if (components.length == 1) componentTree.value.splice(0, 0, component);
      else componentTree.value.push(component);

      registerComponent(component);
    } else {
      throw Error(
        `Unable to import component ${JSON.stringify(componentData).substr(
          0,
          100
        )}`
      );
    }
  });
}
