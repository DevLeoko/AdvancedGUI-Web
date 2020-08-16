<template>
  <div>
    <div class="settings-row">
      <span class="label">Permission</span>
      <input type="text" v-model="action.permission" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PermissionCheck } from "@/utils/actions/PermissionCheck";

export default Vue.extend({
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
