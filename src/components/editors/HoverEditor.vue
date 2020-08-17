<template>
  <div id="hoverSettings">
    <div class="settings-row">
      <input type="checkbox" v-model="component.drawHovered" />
      <span class="label">Show hovered component</span>
    </div>
    <div class="settings-row">
      <p>
        The Hover-Component is a Group-Component that can contain two
        components. The first one is the normal component and the second one
        will be displayed when hovered.
      </p>
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
    margin: 0 10px 0 0 !important;
  }

  p {
    color: $light3 !important;
  }
}
</style>
