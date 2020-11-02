<template>
  <div>
    <div class="settings-row">
      <span class="label">Permission</span>
      <input type="text" v-model="action.permission" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PermissionCheck } from "@/utils/checks/PermissionCheck";

export default defineComponent({
  data() {
    return {};
  },

  props: {
    action: {
      type: Object as () => PermissionCheck,
      required: true
    }
  }
});
</script>
