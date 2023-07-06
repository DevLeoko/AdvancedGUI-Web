import { GroupComponent } from "../components/GroupComponent";
import adminProjectExport from "../../assets/admin-bypass.json";
import { Image } from "../components/Image";
import { Template } from "../components/Template";
import { BACKEND_URL } from "../Config";
import {
  invisibleIDs,
  JsonObject,
  traverseComponent,
  unregisterComponent
} from "../manager/ComponentManager";
import {
  DEFAULT_FONTS,
  fonts,
  regFonts,
  registerFontBase64,
  unregisterFont
} from "../manager/FontManager";
import { unsavedChange } from "../manager/HistoryManager";
import {
  DEFAULT_IMAGES,
  images,
  regImages,
  registerImageBase64,
  unregisterImage
} from "../manager/ImageManager";
import { licensePromptDoneAction } from "../manager/ProjectManager";
import { settings } from "../manager/SettingsManager";
import { migrate, VERSION } from "../manager/UpdateManager";
import {
  addJsonComponentsToRoot,
  componentTree,
  error,
  info,
  loading,
  pauseRendering,
  selection
} from "../manager/WorkspaceManager";
import { Project, ProjectTransferData } from "../Project";

let storedBk = localStorage.getItem("bk");

if (!storedBk) {
  // Gen random bk
  storedBk =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);
  localStorage.setItem("bk", storedBk);
}

export const BK = storedBk;

const SECRET_ELEVATED_LICENSE_KEY = "003c9693-a62b-4b88-93a5-9288524dc532";

function createComponentTreeGroup() {
  return new GroupComponent(
    "component_tree",
    "-",
    [],
    componentTree.value,
    true
  );
}

export function bundleCurrentProjectData() {
  const usedImages: string[] = [];

  componentTree.value.forEach(comp =>
    traverseComponent(comp, c => {
      if (c.displayName == Image.displayName) {
        usedImages.push((c as Image).image);
      }
    })
  );

  const baseGroup = createComponentTreeGroup();

  const projectData: Project = {
    name: settings.projectName,
    version: VERSION,
    invisible: invisibleIDs.value,
    fonts: Object.values(fonts).filter(
      font => !DEFAULT_FONTS.includes(font.name)
    ),
    width: settings.width,
    height: settings.height,
    images: Object.values(images)
      .filter(image => !image.isGif)
      .filter(
        image =>
          !DEFAULT_IMAGES.includes(image.name) ||
          usedImages.includes(image.name)
      )
      .map(image => ({
        name: image.name,
        data: image.data.src
      })),
    gifs: Object.values(images)
      .filter(image => image.isGif)
      .map(image => ({
        name: image.name,
        data: image.data.src
      })),
    componentTree: JSON.parse(baseGroup.toJson()),
    exportedTree: {
      draft: JSON.parse(baseGroup.toJson(true))
    }
  };

  return projectData;
}

export function getCurrentTransferData(): ProjectTransferData {
  return {
    componentTree: JSON.parse(createComponentTreeGroup().toJson(true)),
    invisible: invisibleIDs.value
  };
}

export async function downloadProjectFile(savepoint: Project, key: string) {
  function downloadJson(data: string) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(data);
    const dlAnchorElem = document.getElementById("downloadAnchor")!;
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute(
      "download",
      savepoint.name.replaceAll(" ", "_") + ".json"
    );
    dlAnchorElem.click();
  }

  // License key for devs to get elevated access to the backend
  // This is not a security issue, since the key is hidden in the code
  if (key === SECRET_ELEVATED_LICENSE_KEY) {
    // Skip license check and export directly using admin-bypass
    downloadJson(
      JSON.stringify({
        ...adminProjectExport,
        name: savepoint.name,
        version: savepoint.version
      })
    );
    return;
  }

  loading(true);

  try {
    const resp = await fetch(
      // "http://127.0.0.1:3000/sync",
      `${BACKEND_URL}/convert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "x-bk": BK
        },
        body: JSON.stringify({
          name: savepoint.name,
          invisible: savepoint.invisible,
          componentTree: savepoint.exportedTree.draft
        })
      }
    );

    const data = await resp.text();

    if (resp.status >= 400) throw data;

    const { invisible, componentTree } = JSON.parse(data);

    downloadJson(
      JSON.stringify({
        ...savepoint,
        invisible,
        exportedTree: {
          draft: savepoint.exportedTree.draft,
          finalized: componentTree
        }
      } as Project)
    );
    loading(false);
  } catch (exc) {
    const errorText = `Error during export: ${(exc as Error)?.message || exc}`;
    const licenseError =
      errorText.toLocaleLowerCase().includes("licence") ||
      errorText.toLocaleLowerCase().includes("license");
    error(
      errorText,
      licenseError
        ? {
            label: "Change license key",
            callback: () => {
              licensePromptDoneAction.value = () => {
                /**/
              };
            }
          }
        : undefined
    );
  }
}

export async function downloadCurrentProjectFile(key: string) {
  loading(true);
  const savepoint: Project = bundleCurrentProjectData();
  await downloadProjectFile(savepoint, key);
  loading(false);
}

function checkForUpdate(project: Project): [Project, boolean] {
  if (project.version != VERSION) {
    const oldVersion = project.version;
    const updated = migrate(project);
    info(
      `Your savepoint was still on format-version <b>${oldVersion}</b> and got migrated to the new format-version <b>${VERSION}</b>`,
      true
    );
    return [updated, true];
  }
  return [project, false];
}

export function importComponentFomJson(componentProject: Project) {
  const type = (componentProject.componentTree.components[0] as JsonObject)
    ?.type;
  if (
    componentProject.componentTree.components.length != 1 ||
    !(type == GroupComponent.displayName || type == Template.displayName)
  ) {
    error(
      "You can only import layout files as a component if they contain exactly one group or template component."
    );
  }

  pauseRendering.value = true;
  componentProject = checkForUpdate(componentProject)[0];
  invisibleIDs.value.push(...componentProject.invisible);
  addJsonComponentsToRoot(componentProject.componentTree.components, false);
  pauseRendering.value = false;
}

export async function loadProjectFromJson(
  jsonObj: Project,
  keepResrouces = false
) {
  let updated: boolean;
  [jsonObj, updated] = checkForUpdate(JSON.parse(JSON.stringify(jsonObj)));
  pauseRendering.value = true;

  if (updated) unsavedChange.value = true;

  if (!keepResrouces) {
    regImages
      .filter(img => !DEFAULT_IMAGES.includes(img))
      .forEach(unregisterImage);
    regFonts
      .filter(font => !DEFAULT_FONTS.includes(font))
      .forEach(unregisterFont);
  }

  selection.value = null;

  componentTree.value.forEach(elem => unregisterComponent(elem));
  componentTree.value = [];

  settings.projectName = jsonObj.name || "Starter";

  settings.width = jsonObj.width;
  settings.height = jsonObj.height;

  invisibleIDs.value = jsonObj.invisible;

  addJsonComponentsToRoot(jsonObj.componentTree.components, false);

  if (!keepResrouces) {
    try {
      await Promise.all([
        ...jsonObj.fonts!.map(font => {
          if (!DEFAULT_FONTS.includes(font.name))
            registerFontBase64(font.data, font.name);
        }),
        ...jsonObj.images!.map(image => {
          if (!DEFAULT_IMAGES.includes(image.name))
            registerImageBase64(image.data, image.name, false);
        }),
        ...jsonObj.gifs!.map(image =>
          registerImageBase64(image.data, image.name, true)
        )
      ]);
    } catch (exc) {
      console.error(exc);
    }
  }

  pauseRendering.value = false;
}
