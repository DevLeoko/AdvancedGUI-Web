import { Component } from "../components/Component";
import { getParentComponent } from "../manager/ComponentManager";
import { redo, undo } from "../manager/HistoryManager";
import {
  projectExplorerOpen,
  saveCurrentProject
} from "../manager/ProjectManager";
import { settings } from "../manager/SettingsManager";
import {
  componentTree,
  copiedComponent,
  pasteComponent,
  selection,
  updateSelection
} from "../manager/WorkspaceManager";

function getParentList(component: Component) {
  if (componentTree.value.some(c => c.id == component.id)) {
    return componentTree.value;
  } else {
    return getParentComponent(component)?.getItems();
  }
}

function keyZoom(ev: WheelEvent) {
  if (ev.ctrlKey) {
    settings.zoom += -(ev.deltaY * settings.zoom) / 1000;
    settings.zoom = Math.round(settings.zoom * 100) / 100;
    ev.preventDefault();
  }
}

function keyPress(ev: KeyboardEvent) {
  if (ev.target instanceof HTMLInputElement) return;

  if (projectExplorerOpen.value) return;

  if (ev.ctrlKey && (ev.key == "c" || ev.key == "x")) {
    if (selection.value?.component)
      copiedComponent.value = selection.value.component.toJson();
  }

  if (ev.ctrlKey && ev.key == "v") {
    let target: Component[] = componentTree.value;
    if (selection.value?.component) {
      if (selection.value.component.isGroup()) {
        target = selection.value.component.getItems();
      } else {
        target =
          getParentComponent(selection.value.component)?.getItems() || target;
      }
    }
    pasteComponent(target);
  }

  if (ev.ctrlKey && ev.key == "s") {
    saveCurrentProject();
    ev.preventDefault();
  }

  if (ev.ctrlKey && ev.key == "z") {
    undo();
  }

  if (ev.ctrlKey && ev.key == "y") {
    redo();
  }

  if (ev.code == "Delete" || (ev.ctrlKey && ev.key == "x")) {
    if (selection.value?.component) {
      const parent = getParentList(selection.value.component);
      if (parent) {
        const index = parent.findIndex(
          c => c.id == selection.value?.component.id
        );
        parent.splice(index, 1);
        updateSelection({ value: null });
      }
    }
  }

  if (
    ev.code == "ArrowUp" ||
    ev.code == "ArrowRight" ||
    ev.code == "ArrowLeft" ||
    ev.code == "ArrowDown"
  ) {
    if (selection.value?.component) {
      const bBox = selection.value.component.getBoundingBox();

      const mod = ev.shiftKey ? 10 : 1;

      if (ev.code == "ArrowUp") bBox.y -= mod;
      else if (ev.code == "ArrowDown") bBox.y += mod;
      else if (ev.code == "ArrowRight") bBox.x += mod;
      else if (ev.code == "ArrowLeft") bBox.x -= mod;

      selection.value.component.modify(bBox);
    }
  }
}

export function initializeShortcutHandler() {
  document.addEventListener("keydown", keyPress, { capture: true });
  document.addEventListener("wheel", keyZoom, {
    capture: true,
    passive: false
  });
}

export function shutdownShortcutHandler() {
  document.removeEventListener("keydown", keyPress, { capture: true });
  document.removeEventListener("wheel", keyZoom, {
    capture: true
  });
}
