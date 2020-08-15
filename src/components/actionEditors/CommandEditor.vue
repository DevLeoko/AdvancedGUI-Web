<template>
  <div>
    <div class="settings-row">
      <span class="label">Command</span>
      <input type="text" v-model="action.command" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { CommandAction } from "@/utils/actions/CommandAction";

export default Vue.extend({
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
