<template>
  <div id="viewSettings">
    <div class="settings-row">
      <div class="input-box">
        <select v-model="component.drawIndex">
          <option
            v-for="(comp, index) in component.components"
            :key="index"
            :value="index"
            >{{ index == 0 ? `Default (${comp.id})` : comp.id }}</option
          >
        </select>
        <span>Show component</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { View } from "@/utils/components/View";

export default Vue.extend({
  data() {
    return {};
  },

  props: {
    component: {
      type: Object as () => View
    }
  }
});
</script>

<style lang="scss" scoped>
#viewSettings {
  select {
    width: 140px !important;
  }
}
</style>
