<template>
  <div id="visCheckSettings">
    <div class="settings-row">
      <span class="label">Component ID</span>
      <input type="text" v-model="action.targetId" />
    </div>
    <p class="label" :class="components[action.targetId] ? '' : 'red-text'">
      TARGET{{
        !components[action.targetId]
          ? " NOT FOUND!"
          : ": " + components[action.targetId].name
      }}
    </p>
    <p>
      Action will check whether the component is currently visible for the
      player
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { components } from "@/utils/ComponentManager";
import { VisibilityCheck } from "@/utils/checks/VisibilityCheck";

export default Vue.extend({
  data() {
    return {
      components
    };
  },

  props: {
    action: {
      type: Object as () => VisibilityCheck,
      required: true
    }
  }
});
</script>
