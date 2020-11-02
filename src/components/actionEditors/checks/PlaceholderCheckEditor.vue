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
      Used to check whether the placeholder matches the specified value.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PlaceholderCheck } from "@/utils/checks/PlaceholderCheck";

export default defineComponent({
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
