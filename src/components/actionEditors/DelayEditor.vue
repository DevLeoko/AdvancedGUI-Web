<template>
  <div>
    <div class="settings-row">
      <div class="input-box">
        <input
          type="number"
          @keypress="inputTransformer($event, action.ticks)"
          v-model.number="action.ticks"
        />
        <span>ticks</span>
      </div>
    </div>

    <p>
      This action will delay its child actions by the given amount of ticks
      <i>(1 tick = 50ms)</i>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DelayAction } from "@/utils/actions/DelayAction";
import { Template } from "@/utils/components/Template";

export default defineComponent({
  data() {
    return {
      inputTransformer: Template.inputTransformer
    };
  },

  props: {
    action: {
      type: Object as () => DelayAction,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped></style>
