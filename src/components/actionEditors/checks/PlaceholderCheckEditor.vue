<template>
  <div>
    <div class="settings-row">
      <span class="label">Placeholder</span>
      <input type="text" v-model="action.placeholder" />
    </div>
    <div class="settings-row">
      <span class="label">Value</span>
      <input type="text" v-model="action.value" />
    </div>
    <p>
      Action will check whether the placeholder matches the specified value.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PlaceholderCheck } from "@/utils/checks/PlaceholderCheck";

export default Vue.extend({
  data() {
    return {};
  },

  props: {
    action: {
      type: Object as () => PlaceholderCheck,
      required: true
    }
  }
});
</script>
