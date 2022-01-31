<template>
  <div>
    <div class="settings-row">
      <span class="label">Metadata key</span>
      <input type="text" v-model="action.key" />
    </div>
    <div class="settings-row" v-if="action.value !== undefined">
      <span class="label">New value</span>
      <input type="text" v-model="action.value" />
    </div>
    <div class="settings-row">
      <span class="label">Delete value</span>
      <input
        type="checkbox"
        :checked="action.value === undefined"
        @change="action.value = action.value === undefined ? '' : undefined"
      />
    </div>
    <br />
    <p>
      This action changes to value of <i>%meta.{{ action.key }}%</i>. You can
      use metadata anywhere in the GUI where you could also use placeholders.
      Especially in placeholder-checks to check the value of metadata. Make sure
      to read the wiki for more information on how to work with metadata.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MetadataAction } from "@/utils/actions/MetadataAction";

export default defineComponent({
  data() {
    return {};
  },

  props: {
    action: {
      type: Object as () => MetadataAction,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped></style>
