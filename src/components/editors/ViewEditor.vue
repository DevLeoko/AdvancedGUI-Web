<template>
  <div id="viewSettings">
    <div class="settings-row">
      <div class="input-box">
        <select v-model="component.drawIndex">
          <option
            v-for="(comp, index) in component.components"
            :key="index"
            :value="index"
            >{{ index == 0 ? `Default (${comp.name})` : comp.name }}</option
          >
        </select>
        <span>Show component</span>
      </div>
    </div>
    <div class="settings-row">
      <p>
        The View-Component is a Group-Component that can contain multiple
        components. The first one is the normal component that will be displayed
        by default. With the View-Change-Action you can make the View-Component
        display one of the other components.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { View } from "@/utils/components/View";

export default defineComponent({
  data() {
    return {};
  },

  props: {
    component: {
      type: Object as () => View,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
#viewSettings {
  select {
    width: 140px !important;
  }

  p {
    color: $light3 !important;
  }
}
</style>
