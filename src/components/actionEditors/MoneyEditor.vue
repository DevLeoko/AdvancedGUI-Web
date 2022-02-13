<template>
  <div>
    <div class="settings-row">
      <span class="label">Amount</span>
      <input
        type="number"
        @keypress="inputTransformer($event, action.amount)"
        v-model.number="action.amount"
      />
    </div>
    <p>
      <br />
      Use negative amounts to remove money from a player. <br /><br />
      This action will
      <b>
        {{ action.amount >= 0 ? "add" : "remove" }}
        {{ Math.abs(action.amount) }} money
      </b>
      from the player.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MoneyAction } from "../../utils/actions/MoneyAction";
import { Template } from "../../utils/components/Template";

export default defineComponent({
  data() {
    return {
      inputTransformer: Template.inputTransformer
    };
  },

  props: {
    action: {
      type: Object as () => MoneyAction,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped></style>
