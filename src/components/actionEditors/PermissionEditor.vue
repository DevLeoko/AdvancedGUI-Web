<template>
  <div>
    <div class="settings-row">
      <span class="label">Permission</span>
      <input type="text" v-model="action.permission" />
    </div>
    <div class="settings-row switch-row">
      <span
        class="label"
        :class="action.add ? 'active' : ''"
        @click="action.add = true"
        >ADD</span
      >&nbsp;or&nbsp;
      <span
        class="label"
        :class="!action.add ? 'active' : ''"
        @click="action.add = false"
        >REMOVE</span
      >&nbsp;permission
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PermissionAction } from "@/utils/actions/PermissionAction";

export default defineComponent({
  data() {
    return {};
  },

  props: {
    action: {
      type: Object as () => PermissionAction,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
.switch-row {
  color: $light2;

  .label {
    cursor: pointer;
  }

  .label.active {
    font-weight: bold;
    text-decoration: underline;
  }
}
</style>
