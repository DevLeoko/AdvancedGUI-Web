<template>
  <div id="gifContrSettings">
    <div class="settings-row">
      <span class="label">GIF Component ID</span>
      <input
        type="text"
        class="componentIdInput"
        @focus="idWatcher = val => (action.targetId = val)"
        v-model="action.targetId"
      />
    </div>
    <p
      class="label"
      :class="
        components[action.targetId] &&
        components[action.targetId].displayName == 'GIF'
          ? ''
          : 'red-text'
      "
    >
      TARGET{{
        !components[action.targetId]
          ? " NOT FOUND!"
          : components[action.targetId].displayName != "GIF"
          ? " is not a GIF"
          : ": " + components[action.targetId].name
      }}
    </p>
    <div class="settings-row">
      <span class="label">Pause GIF</span>
      <input type="checkbox" v-model="action.pause" />
    </div>
    <div class="settings-row">
      <span class="label">Reset GIF</span>
      <input type="checkbox" v-model="action.reset" />
    </div>
    <p class="label">
      Action will {{ action.pause ? "" : "un" }}pause the GIF
      <span v-if="action.reset">and reset it to its first frame</span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { components } from "@/utils/manager/ComponentManager";
import { GifControlAction } from "@/utils/actions/GifControlAction";
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
      type: Object as () => GifControlAction,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
#gifContrSettings {
  p {
    margin-top: 0px;
  }
}
</style>
