<template>
  <div>
    <div class="settings-row">
      <div class="input-box">
        <input type="number" v-model.number="action.amount" />
        <span class="label">Amount</span>
      </div>
    </div>
    <div class="settings-row">
      <div class="input-box">
        <input type="number" v-model.number="action.itemId" />
        <span class="label">Item-ID</span>
      </div>
      <div class="input-box">
        <input type="number" v-model.number="action.subId" />
        <span class="label">Sub-ID</span>
      </div>
    </div>
    <div class="settings-row">
      <input
        type="checkbox"
        :checked="action.subId !== null"
        @change="
          val => {
            if (!val.target.checked) action.subId = null;
            else action.subId = 0;
          }
        "
      />
      <span class="label">Check sub-id</span>
    </div>
    <p>
      This action will check whether the player has at least the specified
      amount of the specified item
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ItemCheck } from "@/utils/actions/ItemCheck";

export default Vue.extend({
  data() {
    return {};
  },

  watch: {
    action: {
      deep: true,
      handler(action) {
        if (action.amount === "") this.action.amount = 0;
        if (action.itemId === "") this.action.itemId = 0;
        if (action.subId === "") this.action.subId = null;
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
