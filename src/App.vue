<template>
  <div id="app">
    <app-header />
    <div class="row mainSpace" @click.capture="updateHistory">
      <component-tree />
      <div class="canvasContainer" @click.self="selection = null">
        <my-canvas></my-canvas>
        <toolbar />
      </div>
      <side-bar />
    </div>

    <loading-screen></loading-screen>
    <div ref="imageContainer" style="display:none">
      <img src="images/error.svg" id="broken_TAKEN_ID" />
    </div>
    <a id="downloadAnchor" style="display:none"></a>
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
import { updateHistory } from "./utils/manager/HistoryManager";
import Toolbar from "./components/Toolbar.vue";
import { selection } from "./utils/manager/WorkspaceManager";
import { vueRef } from "./utils/VueRef";

export default defineComponent({
  name: "App",
  components: {
    MyCanvas,
    ComponentTree,
    SideBar,
    LoadingScreen,
    Toolbar,
    AppHeader: Header
  },

  data() {
    return {
      updateHistory,
      selection: vueRef(selection)
    };
  },

  mounted() {
    setupImageManager(this.$refs.imageContainer as HTMLElement);
    this.updateHistory();
    initializeShortcutHandler();
  },

  unmounted() {
    shutdownShortcutHandler();
  }
});
</script>

<style lang="scss">
@import "@/scss/app.scss";
</style>
