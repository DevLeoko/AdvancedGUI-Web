<template>
  <div class="toolbar">
    <div class="zoom">
      <b class="label">ZOOM</b>
      <select v-model.number="settings.zoom">
        <option :value="settings.zoom" style="display: none"
          >{{ (settings.zoom * 100).toFixed(0) }}%</option
        >
        <option value="0.5">50%</option>
        <option value="1">100%</option>
        <option value="2">200%</option>
        <option value="4">400%</option>
      </select>
    </div>

    <div class="historyControls row">
      <div
        class="btnHstr"
        :class="
          history.stack.length <= history.hisotryIndex + 1 ? 'inactive' : ''
        "
        @click.stop="undo"
      >
        <span class="material-icons">undo</span>
      </div>
      <div
        class="btnHstr"
        :class="history.hisotryIndex != 0 ? '' : 'inactive'"
        @click.stop="redo"
      >
        <span class="material-icons">redo</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { history, redo, undo } from "../utils/manager/HistoryManager";
import { settings } from "../utils/manager/SettingsManager";

export default defineComponent({
  data() {
    return {
      history,
      redo,
      undo,
      settings
    };
  }
});
</script>

<style lang="scss" scoped></style>
