<template>
  <div id="visSettings">
    <div class="settings-row">
      <span class="label">Component ID</span>
      <input
        type="text"
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
    <div class="settings-row">
      <span class="label">Visible</span>
      <input type="checkbox" v-model="action.visibility" />
    </div>
    <p class="label">
      Action will make component
      {{ action.visibility ? "visible" : "invisible" }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VisibilityAction } from "@/utils/actions/VisibilityAction";
import { components } from "@/utils/manager/ComponentManager";
import { idWatcher } from "@/utils/manager/WorkspaceManager";
import { vueRef } from "../../utils/VueRef";

export default defineComponent({
  data() {
    return {
      components,
      idWatcher: vueRef(idWatcher)
    };
  },

  props: {
    action: {
      type: Object as () => VisibilityAction,
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
