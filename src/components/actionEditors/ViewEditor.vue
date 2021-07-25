<template>
  <div id="viewSettings">
    <div class="settings-row">
      <span class="label">View ID</span>
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
        components[action.targetId].displayName == 'View'
          ? ''
          : 'red-text'
      "
    >
      TARGET{{
        !components[action.targetId]
          ? " NOT FOUND!"
          : components[action.targetId].displayName != "View"
          ? " is not a View"
          : ": " + components[action.targetId].name
      }}
    </p>
    <div class="settings-row">
      <span class="label">Target ID</span>
      <input
        type="text"
        class="componentIdInput"
        @focus="idWatcher = val => (action.activate = val)"
        v-model="action.activate"
      />
    </div>
    <p
      class="label"
      :class="components[action.activate] && isChild() ? '' : 'red-text'"
    >
      TARGET{{
        !components[action.activate]
          ? " NOT FOUND!"
          : !isChild()
          ? "is not a direct child of view"
          : ": " + components[action.activate].name
      }}
    </p>
    <p>
      This action will make the specified <i>view</i> display the specified
      <i>target</i> for this player.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { components } from "@/utils/manager/ComponentManager";
import { ViewAction } from "@/utils/actions/ViewAction";
import { View } from "@/utils/components/View";
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
      type: Object as () => ViewAction,
      required: true
    }
  },

  methods: {
    isChild() {
      const targetComp = this.components[this.action.targetId] as View;

      return (
        targetComp &&
        targetComp.components &&
        targetComp.components.find(comp => comp.id == this.action.activate)
      );
    }
  }
});
</script>

<style lang="scss" scoped>
#viewSettings {
  p {
    color: $light2;
    margin-top: 0px;
  }
}
</style>
