import { reactive, ref } from "vue";
import {
  loadProjectFromJson,
  bundleCurrentProjectData
} from "../handler/ProjectSerializationHandler";
import { Project } from "../Project";
import { loading } from "./WorkspaceManager";

export const history = reactive({
  stack: [] as Project[],
  hisotryIndex: 0,
  pauseHistoryTracking: false
});

export const unsavedChange = ref(false);

export async function redo() {
  if (history.hisotryIndex == 0) return;

  history.hisotryIndex--;
  const exportData = history.stack[history.hisotryIndex];
  loading(true);
  history.pauseHistoryTracking = true;
  await loadProjectFromJson(exportData, true);
  history.pauseHistoryTracking = false;
  loading(false);
}

export async function undo() {
  if (history.stack.length <= history.hisotryIndex + 1) return;

  history.hisotryIndex++;
  const exportData = history.stack[history.hisotryIndex];
  loading(true);
  history.pauseHistoryTracking = true;
  await loadProjectFromJson(exportData, true);
  history.pauseHistoryTracking = false;
  loading(false);
}

export function updateHistory() {
  const stateObj = JSON.parse(
    JSON.stringify(bundleCurrentProjectData())
  ) as Project;

  delete stateObj.fonts;
  delete stateObj.images;
  delete stateObj.gifs;

  if (
    history.stack.length &&
    JSON.stringify(history.stack[history.hisotryIndex]) ==
      JSON.stringify(stateObj)
  )
    return;

  if (history.stack.length) unsavedChange.value = true;

  history.stack.splice(0, 0, stateObj);
  history.hisotryIndex = 0;
  if (history.stack.length >= 50) history.stack.pop();
}

export function clearHistory() {
  history.hisotryIndex = 0;
  history.stack = [];
}
