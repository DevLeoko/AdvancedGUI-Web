<template>
  <div>
    <div class="settings-row">
      <span class="label">Message</span>
      <textarea type="text" v-model="action.message" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MessageAction } from "@/utils/actions/MessageAction";

export default Vue.extend({
  data() {
    return {};
  },

  props: {
    action: {
      type: Object as () => MessageAction,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped></style>
