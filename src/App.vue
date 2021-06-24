<template>
  <div id="app">
    <template v-if="!projectExplorerOpen">
      <app-header />
      <div class="row mainSpace" @click.capture="updateHistory">
        <component-tree />
        <div class="canvasContainer" @click.self="selection = null">
          <my-canvas></my-canvas>
          <toolbar />
        </div>
        <side-bar />
      </div>
    </template>

    <project-explorer v-else></project-explorer>

    <loading-screen></loading-screen>
    <license-prompt></license-prompt>

    <a id="downloadAnchor" style="display:none"></a>
    <div ref="imageContainer" style="display:none">
      <img
        src="images/error.svg"
        crossorigin="anonymous"
        id="broken_TAKEN_ID"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoadingScreen from "./components/LoadingScreen.vue";
import SideBar from "./components/SideBar.vue";
import ComponentTree from "./components/ComponentTree.vue";
import Header from "./components/Header.vue";
import MyCanvas from "./components/Canvas.vue";
import { setupImageManager } from "./utils/manager/ImageManager";
import {
  initializeShortcutHandler,
  shutdownShortcutHandler
} from "./utils/handler/ShortcutHandler";
import {
  loadProjects,
  projectExplorerOpen
} from "./utils/manager/ProjectManager";
import Toolbar from "./components/Toolbar.vue";
import { loading, selection } from "./utils/manager/WorkspaceManager";
import { vueRef } from "./utils/VueRef";
import ProjectExplorer from "./components/ProjectExplorer.vue";
import { updateHistory } from "./utils/manager/HistoryManager";
import LicensePrompt from "./components/LicensePrompt.vue";

export default defineComponent({
  name: "App",
  components: {
    MyCanvas,
    ComponentTree,
    SideBar,
    LoadingScreen,
    Toolbar,
    ProjectExplorer,
    LicensePrompt,
    AppHeader: Header
  },

  data() {
    return {
      projectExplorerOpen: vueRef(projectExplorerOpen),
      updateHistory,
      selection: vueRef(selection)
    };
  },

  async mounted() {
    setupImageManager(this.$refs.imageContainer as HTMLElement);
    initializeShortcutHandler();
    loading(true);
    await loadProjects();
    loading(false);
  },

  unmounted() {
    shutdownShortcutHandler();
  }
});
</script>

<style lang="scss">
@import "@/scss/app.scss";
</style>
