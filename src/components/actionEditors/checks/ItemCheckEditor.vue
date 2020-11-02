<template>
  <div>
    <div class="settings-row">
      <div class="input-box">
        <input
          type="number"
          @keypress="inputTransformer($event, action.amount)"
          v-model.number="action.amount"
        />
        <span class="label">Amount</span>
      </div>
    </div>
    <div class="settings-row">
      <span class="label">Item-Name</span>
      <input type="text" v-model="action.itemName" />
    </div>
    <p>
      Used to check whether the player has at least the specified amount of the
      specified item. Press F3+H ingame and hover an item to see its name.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ItemCheck } from "@/utils/checks/ItemCheck";
import { Template } from "@/utils/components/Template";

export default defineComponent({
  data() {
    return {
      inputTransformer: Template.inputTransformer
    };
  },

  watch: {
    action: {
      deep: true,
      handler(action) {
        if (action.amount === "") this.action.amount = 0;
      }
    }
  },

  props: {
    action: {
      type: Object as () => ItemCheck,
      required: true
    }
  }
});
</script>
