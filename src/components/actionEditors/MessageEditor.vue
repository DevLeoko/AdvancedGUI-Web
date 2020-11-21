<template>
  <div>
    <div class="settings-row">
      <span class="label">Message</span>
      <textarea v-model="action.message" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MessageAction } from "@/utils/actions/MessageAction";

export default defineComponent({
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
