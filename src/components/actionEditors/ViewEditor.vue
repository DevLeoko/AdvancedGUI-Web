<template>
  <div id="viewSettings">
    <div class="settings-row">
      <span class="label">View ID</span>
      <input type="text" v-model="action.target" />
    </div>
    <p
      class="label"
      :class="
        components[action.target] &&
        components[action.target].displayName == 'View'
          ? ''
          : 'red-text'
      "
    >
      TARGET{{
        !components[action.target]
          ? " NOT FOUND!"
          : components[action.target].displayName != "View"
          ? " is not a View"
          : ": " + components[action.target].name
      }}
    </p>
    <div class="settings-row">
      <span class="label">Target ID</span>
      <input type="text" v-model="action.activate" />
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
import Vue from "vue";
import { components } from "../../utils/ComponentManager";
import { ViewAction } from "@/utils/actions/ViewAction";
import { View } from "../../utils/components/View";

export default Vue.extend({
  data() {
    return {
      components
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
      const targetComp = this.components[this.action.target] as View;

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
