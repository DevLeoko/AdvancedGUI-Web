<template>
  <div id="app">
    <div class="head">
      <b class="label">Project</b>
      <input class="inputProjectName" type="text" v-model="projectName" />
      <div class="input">
        <b class="label">Width</b>
        <span><input type="number" v-model="width" /> frames</span>
      </div>
      <div class="input">
        <b class="label">Height</b>
        <span><input type="number" v-model="height" /> frames</span>
      </div>
      <div>
        <b class="label">ZOOM</b>
        <select v-model.number="zoom">
          <option value="0.5">x0.5</option>
          <option value="1">x1</option>
          <option value="2">x2</option>
          <option value="4">x4</option>
        </select>
      </div>

      <div class="historyControls row">
        <div
          class="btn"
          :class="history.length <= hisotryIndex + 2 ? 'inactive' : ''"
          @click.prevent="undo()"
        >
          <span class="material-icons">undo</span>
          <span class="text">Undo</span>
        </div>
        <div
          class="btn"
          :class="hisotryIndex ? '' : 'inactive'"
          @click.prevent="redo()"
        >
          <span class="material-icons">redo</span>
          <span class="text">Redo</span>
        </div>
      </div>

      <div class="btn import" @click="triggerImportSelector()">
        <span class="material-icons">cloud_upload</span>
        <span class="text">Import project</span>

        <div
          class="btn import secondary"
          @click.stop="triggerImportSelector(true)"
        >
          <span class="material-icons">extension</span>
          <span class="text">Import component</span>
        </div>
      </div>
      <div class="btn export" @click="exportSavepoint()">
        <span class="material-icons">get_app</span>
        <span class="text">Export savepoint</span>
      </div>
      <div class="btn export" @click="exportModal = true">
        <span class="material-icons">get_app</span>
        <span class="text">Export for usage</span>
      </div>
    </div>
    <div class="row mainSpace" @click.capture="updateHistory">
      <div id="compTree">
        <component-list
          class="actualTree"
          root
          :components="elements"
          :value="selected ? selected.component : null"
          @input="updateSelection"
          @copy="val => (copiedComponent = val)"
          @add-child="addChildToTreeElem"
        ></component-list>

        <div class="btn" @click="ev => showCompAddMenu(ev)">
          <span class="material-icons">add</span>
          <span class="text">Add component</span>

          <div class="absoluteMenu compAddMenu" ref="compAddMenu">
            <template v-if="copiedComponent">
              <div class="entry" @click.stop="pasteComponent()">
                <span class="material-icons">content_paste</span>
                Paste
              </div>
              <div class="divider"></div>
            </template>
            <div
              v-for="(key, index) in Object.keys(componentInfo)"
              :key="index"
            >
              <div class="divider" v-if="index != 0"></div>
              <div class="entry" @click.stop="addNewCompoenent(key)">
                <span class="material-icons">{{
                  componentInfo[key].icon
                }}</span>
                {{ key }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="canvasContainer" @click.self="selected = null">
        <my-canvas
          :width="width * 128"
          :height="height * 128"
          :selected="selected ? selected.component : null"
          :elements="elements"
          :zoom="zoom"
          :pauseRendering="pauseRendering"
          @changeIndication="updateHistory"
          @select="updateSelection"
        ></my-canvas>
      </div>
      <div class="sidebar" id="settings">
        <div id="generalSettings" v-if="selected">
          <div class="settings-box gen-box">
            <h1>
              <span
                class="material-icons"
                @click="devMode.value = !devMode.value"
                >{{ devMode.value ? "code" : "tune" }}</span
              >
              General settings
            </h1>
            <div class="settings-row">
              <span class="label">Name</span>
              <input type="text" v-model="selected.component.name" />
            </div>
            <div class="settings-row id-box">
              <span class="label">ID</span>
              <input
                type="text"
                :value="selected.component.id"
                @input="$refs.idInput.value = selected.component.id"
                ref="idInput"
              />
              <span class="material-icons" @click="copyID()" ref="copyIcon"
                >content_copy</span
              >
            </div>
            <div class="settings-row" v-if="selected.component.hideable">
              <span class="label">Visibility</span>
              <input
                type="checkbox"
                :checked="invisible.indexOf(selected.component.id) == -1"
                @change="toggleVis(selected.component.id)"
              />
            </div>
          </div>
          <template v-if="selected.component.actionable">
            <div class="divider"></div>
            <div class="settings-box clickActions">
              <h1>
                <span class="material-icons">touch_app</span> Click Action
              </h1>
              <component-list
                class="sidebar"
                root
                :components="selected.component.clickAction"
                :value="selected.action"
                @input="val => (selected.action = val.value)"
                @copy="val => (copiedAction = val)"
              ></component-list>
              <div class="settings-row">
                <div class="btn addAction" @click="ev => showActionAddMenu(ev)">
                  <span class="material-icons">add</span>
                  <span class="text">Add action</span>

                  <div class="absoluteMenu" ref="actionAddMenu">
                    <template v-if="copiedAction">
                      <div class="entry" @click.stop="pasteAction()">
                        <span class="material-icons">content_paste</span>
                        Paste
                      </div>
                      <div class="divider"></div>
                    </template>
                    <div
                      v-for="(key, index) in Object.keys(actions)"
                      :key="index"
                    >
                      <div class="divider" v-if="index != 0"></div>
                      <div class="entry" @click.stop="addNewAction(key)">
                        <span class="material-icons">{{
                          actions[key].icon
                        }}</span>
                        {{ key }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="selected && selected.action" id="actionEditor">
                <h2>
                  <span class="material-icons">edit</span> Edit
                  {{ selected.action.id.toLowerCase() }}
                </h2>
                <component
                  v-bind:is="actions[selected.action.id].component"
                  :action="
                    selected.action.isCheck()
                      ? selected.action.check
                      : selected.action
                  "
                ></component>
              </div>
            </div>
          </template>
          <div class="divider"></div>
          <div class="settings-box">
            <h1>
              <span class="material-icons">{{ selected.component.icon }}</span>
              {{ selected.component.displayName }}
            </h1>
            <component
              v-bind:is="selected.component.vueComponent"
              :component="selected.component"
              :maxWidth="width * 128"
              :maxHeight="height * 128"
            ></component>
          </div>
        </div>
        <div v-else class="settings-box">
          <h1>
            <b class="label">no component selected</b>
          </h1>
        </div>
      </div>
    </div>

    <export-prompt
      v-model="exportModal"
      @export="externalExport()"
    ></export-prompt>
    <loading-screen></loading-screen>
    <div ref="imageContainer" style="display:none"></div>
    <a ref="downloadAnchor" style="display:none"></a>
    <input
      type="file"
      ref="importFileSelect"
      accept=".json"
      style="display: none"
      @change="checkForUpload()"
    />
  </div>
</template>

<script lang="ts">
import LoadingScreen, {
  loading,
  error,
  info
} from "./components/LoadingScreen.vue";
import ExportPrompt from "./components/ExportPrompt.vue";
import ComponentList from "./components/ComponentList.vue";
import MyCanvas from "./components/Canvas.vue";
import Vue from "vue";
import { Component } from "@/utils/components/Component";
import {
  componentInfo,
  componentFromJson,
  registerComponent,
  invisible,
  toggleVis,
  ExportData,
  unregisterComponent,
  JsonObject
} from "./utils/manager/ComponentManager";
import { actions, actionFromJson } from "./utils/manager/ActionManager";
import {
  setupImageManager,
  images,
  registerImageBase64
} from "./utils/manager/ImageManager";
import { Action } from "./utils/actions/Action";
import { fonts, registerFontBase64 } from "./utils/manager/FontManager";
import { GroupComponent } from "./utils/components/GroupComponent";
import { VERSION, migrate } from "./utils/manager/UpdateManager";
import { Template } from "./utils/components/Template";

const idWatcher: { lastHandler: (val: string) => void } = {
  lastHandler: () => {
    //do nothing
  }
};

export const devMode = { value: false };

export function setWatcher(func: (val: string) => void): void {
  idWatcher.lastHandler = func;
}

export default Vue.extend({
  name: "App",
  components: { ComponentList, MyCanvas, ExportPrompt, LoadingScreen },

  data: () => {
    return {
      width: 3,
      height: 2,
      zoom: 2,

      projectName: "Starter",

      selected: null as null | { component: Component; action: Action | null },

      componentInfo,
      actions,

      devMode,

      exportModal: false,

      setupImageManager,

      copiedComponent: null as null | string,
      copiedAction: null as null | string,

      history: [] as ExportData[],
      hisotryIndex: 0,
      pauseHistoryTracking: false,

      elements: [] as Component[],

      pauseRendering: false,

      addComponentAnchor: null as null | Component[],

      importComponent: false,

      invisible,
      toggleVis
    };
  },

  mounted() {
    document.addEventListener("click", this.checkClose, { capture: true });
    this.setupImageManager(this.$refs.imageContainer as HTMLElement);
    this.updateHistory();
  },

  destroyed() {
    document.removeEventListener("click", this.checkClose, { capture: true });
  },

  methods: {
    updateSelection(data: { value: Component; event: Event }) {
      console.log(document.activeElement);

      if (
        data.value &&
        data.event &&
        document.activeElement?.classList?.contains("componentIdInput")
      ) {
        // (document.activeElement as HTMLInputElement).value = data.value.id;
        idWatcher.lastHandler(data.value.id);
        data.event.preventDefault();
      } else {
        this.selected = data.value
          ? { component: data.value, action: null }
          : null;
      }
    },

    showActionAddMenu(ev: MouseEvent) {
      const menu = this.$refs.actionAddMenu as HTMLElement;
      menu.style.display = "block";
      setTimeout(() => {
        menu.style.top = ev.y + 10 + "px";
        menu.style.left = ev.x - menu.offsetWidth / 2 + "px";
      }, 10);
    },

    updateHistory() {
      const state = JSON.stringify(this.bundleToJson(true));
      if (this.history.length && JSON.stringify(this.history[0]) == state)
        return;

      this.history.splice(0, 0, JSON.parse(state));
      this.hisotryIndex = 0;
      if (this.history.length >= 50) this.history.pop();
    },

    addNewAction(key: string) {
      if (this.selected) {
        const nAction = actions[key].generator(this.selected.component);
        this.selected.component.clickAction.push(nAction);
        this.selected.action = nAction;
      }
    },

    addNewCompoenent(key: string) {
      const nComp = componentInfo[key].generator();
      registerComponent(nComp);

      this.addComponentAnchor!.splice(0, 0, nComp);
      this.selected = {
        component: nComp,
        action: null
      };
      const menu = this.$refs.compAddMenu as HTMLElement;
      menu.style.display = "none";
    },

    checkClose(ev: MouseEvent) {
      const menuComp = this.$refs.compAddMenu as HTMLElement;

      if (ev.target != menuComp) menuComp.style.display = "none";

      const menuAction = this.$refs.actionAddMenu as HTMLElement;
      if (menuAction && ev.target != menuAction)
        menuAction.style.display = "none";
    },

    addChildToTreeElem(data: { event: MouseEvent; anchor: Component[] }) {
      this.showCompAddMenu(data.event, data.anchor);
    },

    showCompAddMenu(
      ev: MouseEvent,
      anchor = undefined as undefined | Component[]
    ) {
      const menu = this.$refs.compAddMenu as HTMLElement;
      menu.style.display = "block";
      menu.style.opacity = "0";
      this.addComponentAnchor = anchor || this.elements;

      setTimeout(() => {
        let y = ev.y;

        if (y + menu.offsetHeight > window.innerHeight)
          y = ev.y - menu.offsetHeight - 5;

        menu.style.opacity = "1";
        menu.style.top = y + "px";
        menu.style.left = ev.x + "px";
      }, 3);
    },

    pasteAction() {
      if (this.selected && this.copiedAction) {
        const nAction = actionFromJson(JSON.parse(this.copiedAction));
        this.selected.component.clickAction.push(nAction);
        this.selected.action = nAction;
      }
    },

    pasteComponent() {
      if (this.copiedComponent) {
        const nComp = componentFromJson(
          JSON.parse(this.copiedComponent),
          true
        )!;
        this.elements.splice(0, 0, nComp);
        this.selected = {
          component: nComp,
          action: null
        };
      }
    },

    copyID() {
      const input = this.$refs.idInput as HTMLInputElement;
      const icon = this.$refs.copyIcon as HTMLElement;

      input.select();
      input.setSelectionRange(0, 99999);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.execCommand("copy");

      icon.innerText = "assignment_turned_in";

      setTimeout(() => (icon.innerText = "content_copy"), 1000);
    },

    exportSavepoint() {
      loading(true);
      setTimeout(() => {
        this.exportData(JSON.stringify(this.bundleToJson()), true);
        loading(false);
      });
    },

    exportData(data: string, asSavepoint: boolean) {
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(data);
      const dlAnchorElem = this.$refs.downloadAnchor as HTMLElement;
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute(
        "download",
        this.projectName.replaceAll(" ", "_") +
          (asSavepoint ? "_savepoint" : "") +
          ".json"
      );
      dlAnchorElem.click();
    },

    bundleToJson(skipResources = false, forUsage = false) {
      const compTree = new GroupComponent(
        "component_tree",
        "-",
        [],
        this.elements,
        true
      );
      const exportJsonObj: ExportData = {
        type: "savepoint",
        name: this.projectName,
        version: VERSION,
        invisible: invisible,
        fonts: skipResources ? undefined : Object.values(fonts),
        width: this.width,
        height: this.height,
        images: skipResources
          ? undefined
          : Object.values(images)
              .filter(image => !image.isGif)
              .map(image => ({
                name: image.name,
                data: image.data.src
              })),
        gifs: skipResources
          ? undefined
          : Object.values(images)
              .filter(image => image.isGif)
              .map(image => ({
                name: image.name,
                data: image.data.src
              })),
        componentTree: JSON.parse(compTree.toJson(forUsage))
      };

      return exportJsonObj;
    },

    async redo() {
      if (this.hisotryIndex == 0) return;

      this.hisotryIndex--;
      const exportData = this.history[this.hisotryIndex];
      loading(true);
      this.pauseHistoryTracking = true;
      await this.loadFromJsonObj(exportData, true, true);
      this.pauseHistoryTracking = false;
      loading(false);
    },

    async undo() {
      if (this.history.length <= this.hisotryIndex + 2) return;

      this.hisotryIndex++;
      const exportData = this.history[this.hisotryIndex];
      loading(true);
      this.pauseHistoryTracking = true;
      await this.loadFromJsonObj(exportData, true, true);
      this.pauseHistoryTracking = false;
      loading(false);
    },

    async loadFromJsonObj(
      jsonObj: ExportData,
      resetOld: boolean,
      keepResrouces = false
    ) {
      this.pauseRendering = true;
      if (jsonObj.type != "savepoint")
        throw Error("This .json file is not an AdvancedGUI savepoint!");

      if (!resetOld) {
        const type = (jsonObj.componentTree.components[0] as JsonObject)?.type;
        if (
          jsonObj.componentTree.components.length != 1 ||
          !(type == GroupComponent.displayName || type == Template.displayName)
        ) {
          throw Error(
            "You can only import layout files as a component if they contain exactly one group or template component."
          );
        }
      }

      if (jsonObj.version != VERSION) {
        const oldVersion = jsonObj.version;
        jsonObj = migrate(jsonObj);
        info(
          `Your savepoint was still on format-version <b>${oldVersion}</b> and got migrated to the new format-version <b>${VERSION}</b>`,
          true
        );
      }

      if (!keepResrouces) {
        Object.keys(images).forEach(key => delete images[key]);
        Object.keys(fonts).forEach(key => delete fonts[key]);
      }

      if (resetOld) {
        this.selected = null;
        this.copiedAction = null;
        this.copiedComponent = null;

        this.elements.forEach(elem => unregisterComponent(elem));
        this.elements = [];

        this.projectName = jsonObj.name || "Starter";

        this.width = jsonObj.width;
        this.height = jsonObj.height;

        invisible.splice(0, invisible.length);
      }

      invisible.push(...jsonObj.invisible);
      jsonObj.componentTree.components.forEach(componentData => {
        const component = componentFromJson(componentData, !resetOld);

        if (component) {
          if (jsonObj.componentTree.components.length == 1)
            this.elements.splice(0, 0, component);
          else this.elements.push(component);
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

      // i.e. if this is not an exact replacement action
      if (!(keepResrouces && resetOld)) {
        try {
          await Promise.all([
            ...jsonObj.fonts!.map(font =>
              registerFontBase64(font.data, font.name)
            ),
            ...jsonObj.images!.map(image =>
              registerImageBase64(image.data, image.name, false)
            ),
            ...jsonObj.gifs!.map(image =>
              registerImageBase64(image.data, image.name, true)
            )
          ]);
        } catch (exc) {
          console.error(exc);
        }
      }

      this.pauseRendering = false;
    },

    async checkForUpload() {
      const selector = this.$refs.importFileSelect as HTMLInputElement;

      if (selector.files?.length) {
        loading(true);
        const file = selector.files[0];
        const json = await file.text();
        this.loadFromJsonObj(
          JSON.parse(json),
          !this.importComponent,
          this.importComponent
        )
          .then(() => loading(false))
          .catch((err: Error) => {
            console.log(err);
            error(
              err.message ||
                "Failed to import! There seems to be something wrong with the savepoint"
            );
          });
        selector.value = "";
      }
    },

    triggerImportSelector(componentMode = false) {
      this.importComponent = componentMode;
      (this.$refs.importFileSelect as HTMLElement).click();
    },

    externalExport() {
      this.exportModal = false;
      loading(true);

      const savepoint = this.bundleToJson(false, true);
      const { fonts, images, gifs } = savepoint;
      delete (savepoint as JsonObject).images;
      delete (savepoint as JsonObject).fonts;
      delete (savepoint as JsonObject).gifs;
      fetch(
        "https://advancedgui-convert.netlify.app/.netlify/functions/convert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(savepoint)
        }
      )
        .then(resp => resp.text())
        .then(data => {
          const processed = {
            images,
            fonts,
            gifs,
            ...JSON.parse(data)
          };
          this.exportData(JSON.stringify(processed), false);
          loading(false);
        })
        .catch((err: Error) => error(`Error durring export: ${err.message}`));
    }
  }
});
</script>

<style lang="scss">
@import "@/scss/app.scss";
</style>
