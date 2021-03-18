<template>
  <div>
    <div class="settings-row">
      <span class="label">Command</span>
      <input type="text" v-model="action.command" />
    </div>
    <div class="settings-row">
      <span class="label">Run as console</span>
      <input type="checkbox" v-model="action.asConsole" />
    </div>
    <!-- <div class="settings-row">
      <span class="label">Run as operator (bypass player permissions)</span>
      <input type="checkbox" v-model="action.asOperator" />
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CommandAction } from "@/utils/actions/CommandAction";

export default defineComponent({
  data() {
    return {};
  },

  props: {
    action: {
      type: Object as () => CommandAction,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped></style>
