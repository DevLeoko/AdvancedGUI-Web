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
import { defineComponent } from "vue";
import { Hover } from "@/utils/components/Hover";

export default defineComponent({
  data() {
    return {};
  },

  props: {
    component: {
      type: Object as () => Hover,
      required: true
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
