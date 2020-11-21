<template>
  <div class="head">
    <b class="label">Project</b>
    <input
      class="inputProjectName"
      type="text"
      v-model="settings.projectName"
    />
    <div class="input">
      <b class="label">Width</b>
      <span><input type="number" v-model="settings.width" /> frames</span>
    </div>
    <div class="input">
      <b class="label">Height</b>
      <span><input type="number" v-model="settings.height" /> frames</span>
    </div>
    <div>
      <b class="label">ZOOM</b>
      <select v-model.number="settings.zoom">
        <option :value="settings.zoom" style="display: none"
          >x{{ settings.zoom }}</option
        >
        <option value="0.5">x0.5</option>
        <option value="1">x1</option>
        <option value="2">x2</option>
        <option value="4">x4</option>
      </select>
    </div>

    <div class="historyControls row">
      <div
        class="btn"
        :class="canUndo ? 'inactive' : ''"
        @click.prevent="$emit('undo')"
      >
        <span class="material-icons">undo</span>
        <span class="text">Undo</span>
      </div>
      <div
        class="btn"
        :class="canRedo ? '' : 'inactive'"
        @click.prevent="$emit('redo')"
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
    <div class="btn export" @click="$emit('export', true)">
      <span class="material-icons">get_app</span>
      <span class="text">Export savepoint</span>
    </div>
    <div class="btn export" @click="exportModal = true">
      <span class="material-icons">get_app</span>
      <span class="text">Export for usage</span>
    </div>

    <input
      type="file"
      ref="importFileSelect"
      accept=".json"
      style="display: none"
      @change="checkForUpload()"
    />

    <export-prompt v-model="exportModal" @export="exportProj()"></export-prompt>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { GeneralSettings } from "@/App.vue";

import { loading } from "@/components/LoadingScreen.vue";
import ExportPrompt from "@/components/ExportPrompt.vue";

export default defineComponent({
  props: {
    settings: {
      type: Object as () => GeneralSettings,
      required: true
    },
    canUndo: {
      type: Boolean
    },
    canRedo: {
      type: Boolean
    }
  },

  components: { ExportPrompt },

  data() {
    return {
      importComponent: false,
      exportModal: false
    };
  },

  methods: {
    async checkForUpload() {
      const selector = this.$refs.importFileSelect as HTMLInputElement;

      if (selector.files?.length) {
        loading(true);
        const file = selector.files[0];
        const json = await file.text();
        this.$emit("load-project", JSON.parse(json), this.importComponent);
        selector.value = "";
      }
    },

    triggerImportSelector(componentMode = false) {
      this.importComponent = componentMode;
      (this.$refs.importFileSelect as HTMLElement).click();
    },

    exportProj() {
      this.exportModal = false;
      this.$emit("export", false);
    }
  }
});
</script>

<style lang="scss" scoped></style>
