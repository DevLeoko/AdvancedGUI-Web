<template>
  <div id="hoverSettings">
    <div class="settings-row">
      <input type="checkbox" v-model="component.drawClicked" />
      <span class="label">Show clicked component</span>
    </div>
    <div class="settings-row">
      <p>
        The Click Animation Component is a Group-Component that can contain two
        components. The first one is the normal component and the second one
        will be displayed for a brief moment when the defalt component is
        clicked.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ClickAnimation } from "@/utils/components/ClickAnimation";

export default defineComponent({
  data() {
    return {};
  },

  props: {
    component: {
      type: Object as () => ClickAnimation,
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
