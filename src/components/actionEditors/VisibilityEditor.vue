<template>
  <div id="visSettings">
    <div class="settings-row">
      <span class="label">Component ID</span>
      <input type="text" v-model="action.target" />
    </div>
    <p class="label" :class="components[action.target] ? '' : 'red-text'">
      TARGET{{
        !components[action.target]
          ? " NOT FOUND!"
          : ": " + components[action.target].name
      }}
    </p>
    <div class="settings-row">
      <span class="label">Visible</span>
      <input type="checkbox" v-model="action.visible" />
    </div>
    <p class="label">
      Action will make component {{ action.visible ? "visible" : "invisible" }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { VisiblityAction } from "@/utils/actions/VisibilityAction";
import { components } from "../../utils/ComponentManager";

export default Vue.extend({
  data() {
    return {
      components
    };
  },

  props: {
    action: {
      type: Object as () => VisiblityAction,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
#visSettings {
  p {
    margin-top: 0px;
  }
}
</style>
