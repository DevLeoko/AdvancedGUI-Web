<template>
  <div id="hoverSettings">
    <div class="settings-row">
      <input type="checkbox" v-model="component.drawHovered" />
      <span class="label">Show hovered component</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Hover } from "@/utils/components/Hover";

export default Vue.extend({
  data() {
    return {};
  },

  props: {
    component: {
      type: Object as () => Hover
    }
  }
});
</script>

<style lang="scss" scoped>
#hoverSettings {
  input {
    margin: 0 5px 0 0;
  }
}
</style>
