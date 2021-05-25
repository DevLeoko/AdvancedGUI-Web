<template>
  <div id="checkCompSettings">
    <div class="settings-row">
      <input type="checkbox" v-model="component.drawNegative" />
      <span class="label">Show negative component</span>
    </div>
    <div class="settings-row">
      <div class="input-box">
        <select
          :value="component.check.name"
          @change="component.check = checks[$event.target.value].generator()"
        >
          <option
            v-for="checkType in checkIDs"
            :key="checkType"
            :value="checkType"
            >{{ checkType }}</option
          >
        </select>
        <span>Check-Type</span>
      </div>
    </div>
    <div class="settings-row">
      <component
        v-bind:is="checks[component.check.name].component"
        :action="component.check"
      ></component>
    </div>
    <div class="settings-row">
      <p>
        The Check-Component is a Group-Component that can contain two
        components. The first one will be visible if the check passes and the
        second one when not.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CheckComponent } from "@/utils/components/CheckComponent";
import { checks, checkIDs } from "../../utils/manager/CheckManager";
import { error } from "../../utils/manager/WorkspaceManager";

export default defineComponent({
  data() {
    return {
      checks,
      checkIDs,
      error
    };
  },

  props: {
    component: {
      type: Object as () => CheckComponent,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
#checkCompSettings {
  input {
    margin: 0 10px 0 0 !important;
  }

  p {
    color: $light3 !important;
  }

  select {
    width: 170px !important;
  }
}
</style>
