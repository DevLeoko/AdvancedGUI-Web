<template>
  <div id="visCheckSettings">
    <div class="settings-row">
      <span class="label">Component ID</span>
      <input
        type="text"
        ref="test"
        class="componentIdInput"
        @focus="idWatcher = val => (action.targetId = val)"
        v-model="action.targetId"
      />
    </div>
    <p class="label" :class="components[action.targetId] ? '' : 'red-text'">
      TARGET{{
        !components[action.targetId]
          ? " NOT FOUND!"
          : ": " + components[action.targetId].name
      }}
    </p>
    <p>
      Used to check whether the component is currently visible for the player
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { components } from "@/utils/manager/ComponentManager";
import { VisibilityCheck } from "@/utils/checks/VisibilityCheck";
import { idWatcher } from "@/utils/manager/WorkspaceManager";
import { vueRef } from "../../../utils/VueRef";

export default defineComponent({
  data() {
    return {
      components,
      idWatcher: vueRef(idWatcher)
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
