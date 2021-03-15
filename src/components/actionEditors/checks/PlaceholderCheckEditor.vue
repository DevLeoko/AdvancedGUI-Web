<template>
  <div>
    <div class="settings-row">
      <span class="label">Placeholder</span>
      <input type="text" v-model="action.placeholder" />
    </div>
    <div class="settings-row">
      <span class="label">Comparison Type</span>
      <select v-model.number="action.compType">
        <option :value="-1">Text equals</option>
        <option :value="0"> &lt; </option>
        <option :value="1"> &lt;= </option>
        <option :value="2"> = </option>
        <option :value="3"> &gt;= </option>
        <option :value="4"> &gt; </option>
      </select>
    </div>
    <div class="settings-row">
      <span class="label">Value</span>
      <input
        :type="action.compType == -1 ? 'text' : 'number'"
        v-model="action.value"
      />
    </div>
    <p v-if="action.compType == -1">
      Checks whether the placeholder {{ action.placeholder }} has the value "{{
        action.value
      }}"
    </p>
    <p v-else>
      Checks whether: {{ action.placeholder }} {{ compText }}
      {{ action.value }}
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
  },

  computed: {
    compText(): string {
      switch (this.action.compType) {
        case -1:
          return "text eq";
        case 0:
          return "<";
        case 1:
          return "<=";
        case 2:
          return "=";
        case 3:
          return ">=";
        case 4:
          return ">";
        default:
          return this.action.compType.toString();
      }
    }
  }
});
</script>
