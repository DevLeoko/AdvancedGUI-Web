<template>
  <div id="app">
    <app-header
      :settings="settings"
      :can-undo="history.length <= hisotryIndex + 2"
      :can-redo="hisotryIndex != 0"
      @undo="undo"
      @redo="redo"
      @load-project="loadProject"
      @export="this.exportSavepoint()"
      @export-usage="key => this.externalExport(key)"
    />
    <div class="row mainSpace" @click.capture="updateHistory">
      <component-tree
        :components="elements"
        v-model:copied-component="copiedComponent"
        @paste="pasteComponent()"
        :selected="selected ? selected.component : null"
        @select="updateSelection"
      />

      <div id="canvasContainer" @click.self="selected = null">
        <my-canvas
          :width="settings.width * 128"
          :height="settings.height * 128"
          :selected="selected ? selected.component : null"
          :elements="elements"
          :zoom="settings.zoom"
          :pause-rendering="pauseRendering"
          @change-indication="updateHistory"
          @select="updateSelection"
        ></my-canvas>
      </div>
      <side-bar :selected="selected" :settings="settings" />
    </div>

    <loading-screen></loading-screen>
    <div ref="imageContainer" style="display:none">
      <img src="images/error.svg" id="borken_TAKEN_ID" />
    </div>
    <a ref="downloadAnchor" style="display:none"></a>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import LoadingScreen, {
  loading,
  error,
  info
} from "./components/LoadingScreen.vue";
import SideBar from "./components/SideBar.vue";
import ComponentTree from "./components/ComponentTree.vue";
import Header from "./components/Header.vue";
import MyCanvas from "./components/Canvas.vue";
import { Component } from "@/utils/components/Component";
import {
  componentFromJson,
  registerComponent,
  invisible,
  ExportData,
  unregisterComponent,
  JsonObject,
  getParentComponent
} from "./utils/manager/ComponentManager";
import {
  setupImageManager,
  images,
  registerImageBase64,
  regImages,
  unregisterImage
} from "./utils/manager/ImageManager";
import {
  fonts,
  regFonts,
  registerFontBase64,
  unregisterFont
} from "./utils/manager/FontManager";
import { GroupComponent } from "./utils/components/GroupComponent";
import { VERSION, migrate } from "./utils/manager/UpdateManager";
import { Template } from "./utils/components/Template";
import { Selection } from "./utils/Selection";

const idWatcher: { lastHandler: (val: string) => void } = {
  lastHandler: () => {
    //do nothing
  }
};

export const devMode = ref(false);

export function setWatcher(func: (val: string) => void): void {
  idWatcher.lastHandler = func;
}

export interface GeneralSettings {
  width: number;
  height: number;
  zoom: number;
  projectName: string;
}

export default defineComponent({
  name: "App",
  components: {
    MyCanvas,
    ComponentTree,
    SideBar,
    LoadingScreen,
    AppHeader: Header
  },

  data() {
    return {
      settings: {
        width: 3,
        height: 2,
        zoom: 2,
        projectName: "Starter"
      } as GeneralSettings,

      selected: null as Selection,

      history: [] as ExportData[],
      hisotryIndex: 0,
      pauseHistoryTracking: false,

      copiedComponent: null as string | null,

      elements: [] as Component[],

      pauseRendering: false
    };
  },

  mounted() {
    setupImageManager(this.$refs.imageContainer as HTMLElement);
    this.updateHistory();

    document.addEventListener("keydown", this.keyPress, { capture: true });
    document.addEventListener("wheel", this.keyZoom, {
      capture: true,
      passive: false
    });
  },

  unmounted() {
    document.removeEventListener("keydown", this.keyPress, { capture: true });
    document.removeEventListener("wheel", this.keyZoom, {
      capture: true
    });
  },

  methods: {
    keyZoom(ev: WheelEvent) {
      if (ev.ctrlKey) {
        this.settings.zoom += -(ev.deltaY * this.settings.zoom) / 1000;
        this.settings.zoom = Math.round(this.settings.zoom * 100) / 100;
        ev.preventDefault();
      }
    },

    keyPress(ev: KeyboardEvent) {
      if (ev.target instanceof HTMLInputElement) return;

      if (ev.ctrlKey && (ev.key == "c" || ev.key == "x")) {
        if (this.selected?.component)
          this.copiedComponent = this.selected.component.toJson();
      }

      if (ev.ctrlKey && ev.key == "v") {
        let target: Component[] = this.elements;
        if (this.selected?.component) {
          if (this.selected.component.isGroup()) {
            target = this.selected.component.getItems();
          } else {
            target =
              getParentComponent(this.selected.component)?.getItems() || target;
          }
        }
        this.pasteComponent(target);
      }

      if (ev.ctrlKey && ev.key == "s") {
        this.exportSavepoint();
        ev.preventDefault();
      }

      if (ev.ctrlKey && ev.key == "z") {
        this.undo();
      }

      if (ev.ctrlKey && ev.key == "y") {
        this.redo();
      }

      if (ev.code == "Delete" || (ev.ctrlKey && ev.key == "x")) {
        if (this.selected?.component) {
          const parent = this.getParentList(this.selected.component);
          if (parent) {
            const index = parent.findIndex(
              c => c.id == this.selected?.component.id
            );
            parent.splice(index, 1);
            this.updateSelection({ value: null });
          }
        }
      }

      if (
        ev.code == "ArrowUp" ||
        ev.code == "ArrowRight" ||
        ev.code == "ArrowLeft" ||
        ev.code == "ArrowDown"
      ) {
        if (this.selected?.component) {
          const bBox = this.selected.component.getBoundingBox();

          const mod = ev.shiftKey ? 10 : 1;

          if (ev.code == "ArrowUp") bBox.y -= mod;
          else if (ev.code == "ArrowDown") bBox.y += mod;
          else if (ev.code == "ArrowRight") bBox.x += mod;
          else if (ev.code == "ArrowLeft") bBox.x -= mod;

          this.selected.component.modify(bBox);
        }
      }
    },

    getParentList(component: Component) {
      if (this.elements.some(c => c.id == this.selected?.component.id)) {
        return this.elements;
      } else {
        return getParentComponent(component)?.getItems();
      }
    },

    pasteComponent(target?: Component[]) {
      if (!target) {
        target = this.elements;
      }

      if (this.copiedComponent) {
        const nComp = componentFromJson(
          JSON.parse(this.copiedComponent),
          true
        )!;

        target.splice(0, 0, nComp);
        this.updateSelection({ value: nComp });
      }
    },

    updateSelection(data: { value: Component | null; event?: Event }) {
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

    loadProject(json: JsonObject, compImport: boolean) {
      this.loadFromJsonObj(json as ExportData, !compImport, compImport)
        .then(() => loading(false))
        .catch((err: Error) => {
          console.log(err);
          error(
            err.message ||
              "Failed to import! There seems to be something wrong with the savepoint"
          );
        });
    },

    updateHistory() {
      const state = JSON.stringify(this.bundleToJson(true));
      if (this.history.length && JSON.stringify(this.history[0]) == state)
        return;

      this.history.splice(0, 0, JSON.parse(state));
      this.hisotryIndex = 0;
      if (this.history.length >= 50) this.history.pop();
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
        this.settings.projectName.replaceAll(" ", "_") +
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
        name: this.settings.projectName,
        version: VERSION,
        invisible: invisible,
        fonts: skipResources ? undefined : Object.values(fonts),
        width: this.settings.width,
        height: this.settings.height,
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
        regImages.forEach(img => unregisterImage(img));
        regFonts.forEach(font => unregisterFont(font));
      }

      if (resetOld) {
        this.selected = null;

        this.elements.forEach(elem => unregisterComponent(elem));
        this.elements = [];

        this.settings.projectName = jsonObj.name || "Starter";

        this.settings.width = jsonObj.width;
        this.settings.height = jsonObj.height;

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

    externalExport(key: string) {
      loading(true);

      const savepoint = this.bundleToJson(false, true);
      const { fonts, images, gifs } = savepoint;
      delete (savepoint as JsonObject).images;
      delete (savepoint as JsonObject).fonts;
      delete (savepoint as JsonObject).gifs;
      fetch(
        // "http://localhost:8888/.netlify/functions/convert",
        "https://advancedgui-convert.netlify.app/.netlify/functions/convert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            key,
            savepoint
          })
        }
      )
        .then(async resp => {
          if (resp.status >= 400) throw await resp.text();
          else return resp.text();
        })
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
        .catch((err: Error) =>
          error(`Error durring export: ${err.message || err}`)
        );
    }
  }
});
</script>

<style lang="scss">
@import "@/scss/app.scss";
</style>
