import localforage from "localforage";
import { ref } from "vue";
import { GroupComponent } from "../components/GroupComponent";
import { getCookie } from "../CookieUtils";
import {
  bundleProjectData,
  downloadProjectFile,
  loadProjectFromJson
} from "../handler/ProjectSerializationHandler";
import { Project } from "../Project";
import { clearHistory, unsavedChange } from "./HistoryManager";
import { settings } from "./SettingsManager";
import { migrate, VERSION } from "./UpdateManager";
import { error } from "./WorkspaceManager";

export const projectExplorerOpen = ref(true);

export const projects = ref([] as Project[]);
export const licensePromptDoneAction = ref(null as null | Function);
export const licenseKey = ref(getCookie("license-key") || "");

let lastOpendProjectName = "";

async function updateProjectNames() {
  await localforage.setItem(
    "projectNames",
    JSON.stringify(projects.value.map(p => p.name))
  );
}

export async function loadProjects() {
  projects.value = [];

  const projectNames = JSON.parse(
    (await localforage.getItem("projectNames")) || "[]"
  ) as string[];

  for (const name of projectNames) {
    projects.value.push(
      JSON.parse((await localforage.getItem(`project/${name}`))! as string)
    );
  }
}

export async function importProject(data: Project) {
  if (data.version && data.name) {
    while (projects.value.some(proj => proj.name == data.name)) {
      data.name += " - 2";
    }

    delete data.exportedTree;

    projects.value.splice(0, 0, data);
    await localforage.setItem(`project/${data.name}`, JSON.stringify(data));

    await updateProjectNames();
  } else {
    error("This does not look like a AdvancedGUI project file.");
  }
}

export async function deleteProject(name: string) {
  projects.value.splice(
    projects.value.findIndex(p => p.name == name),
    1
  );

  await localforage.removeItem(`project/${name}`);
  await localforage.removeItem(`thumbnail/${name}`);

  await updateProjectNames();
}

export function exportProject(name: string) {
  const exportAction = () =>
    downloadProjectFile(
      projects.value.find(p => p.name == name)!,
      licenseKey.value
    );
  if (!licenseKey.value) {
    licensePromptDoneAction.value = exportAction;
    return;
  }

  exportAction();
}

export function exportCurrentProject() {
  const savepoint = bundleProjectData();

  if (!licenseKey.value) {
    licensePromptDoneAction.value = () =>
      downloadProjectFile(savepoint, licenseKey.value);
    return;
  }

  downloadProjectFile(savepoint, licenseKey.value);
}

export async function saveCurrentProject() {
  const savepoint = bundleProjectData();

  const nameChange = savepoint.name != lastOpendProjectName;
  if (nameChange) {
    while (projects.value.some(p => p.name == savepoint.name)) {
      savepoint.name += " - 2";
    }

    await localforage.setItem(
      `thumbnail/${savepoint.name}`,
      await localforage.getItem(`thumbnail/${lastOpendProjectName}`)
    );

    await localforage.removeItem(`project/${lastOpendProjectName}`);
    await localforage.removeItem(`thumbnail/${lastOpendProjectName}`);

    settings.projectName = savepoint.name;
    lastOpendProjectName = savepoint.name;
  }

  const index = projects.value.findIndex(p => p.name == lastOpendProjectName);

  projects.value.splice(index, 1, savepoint);

  await localforage.setItem(
    `project/${savepoint.name}`,
    JSON.stringify(savepoint)
  );

  if (nameChange) await updateProjectNames();

  unsavedChange.value = false;
}

export async function updateProject(project: Project) {
  migrate(project);

  await localforage.setItem(`project/${project.name}`, JSON.stringify(project));

  const index = projects.value.findIndex(p => p.name == lastOpendProjectName);
  projects.value.splice(index, 1, project);
}

export function openProject(project: Project) {
  lastOpendProjectName = project.name;
  loadProjectFromJson(project, false);
  projectExplorerOpen.value = false;

  clearHistory();
  unsavedChange.value = false;
}

export async function openNewProject() {
  let num = 1;
  let name = "Unnamed";

  while (projects.value.some(proj => proj.name == name)) {
    num++;
    name = `Unnamed ${num}`;
  }

  const newProject = {
    name,
    height: 2,
    width: 3,
    version: VERSION,
    invisible: [],
    fonts: [],
    gifs: [],
    images: [],
    componentTree: new GroupComponent("component_tree", "-", [], [], true)
  };

  openProject(newProject);
  projects.value.splice(0, 0, newProject);
  await saveCurrentProject();

  await updateProjectNames();
}

export async function updateCurrentThumbnail(dataUrl: string) {
  await localforage.setItem(`thumbnail/${lastOpendProjectName}`, dataUrl);
}

export async function getThumbnail(project: string) {
  return await localforage.getItem(`thumbnail/${project}`);
}
