<template>
  <div id="templateSettings">
    <div
      v-for="(data, i) in component.defaultData"
      :key="i"
      class="settings-row"
    >
      <select
        :value="typeof data.value == 'number'"
        @change="
          $event.target.value == 'true'
            ? (data.value = 123)
            : (data.value = 'value')
        "
      >
        <option :value="true">Number</option>
        <option :value="false">Text</option>
      </select>
      <span class="label">#</span><input type="text" v-model="data.name" />
      <span class="label">=</span>
      <input
        v-if="typeof data.value == 'number'"
        type="number"
        v-model.number="data.value"
      />
      <input v-else type="text" v-model="data.value" />
      <span
        class="material-icons closeIcon"
        @click="component.defaultData.splice(i, 1)"
        >close</span
      >
    </div>
    <div
      class="btn"
      @click="component.defaultData.push({ name: 'varName', value: 'value' })"
    >
      <span class="material-icons">add</span>
      <span class="text">Add variable</span>
    </div>
    <p>
      Use <i>#variableName</i> in any text-input within this template to use the
      corresponding variable. You can also use them in actions. Make sure that
      each variable is actually assined a value. In number-inputs you can press
      '#' to activate text-input (only avalable for some inputs).
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Template } from "@/utils/components/Template";

export default defineComponent({
  data() {
    return {};
  },

  props: {
    component: {
      type: Object as () => Template,
      required: true
    }
  }
});
</script>

<style lang="scss">
#templateSettings {
  input,
  select {
    border: none !important;
    border-bottom: 1px $light4 solid !important;
    border-radius: 0 !important;
    width: 90px !important;
    margin: 0 5px !important;
  }

  input {
    width: 70px !important;
  }

  .btn {
    margin-top: 15px;
  }

  .closeIcon {
    color: $red;
    font-size: 18px;
    cursor: pointer;
  }

  p {
    color: $light3 !important;
    margin-top: 15px !important;
  }
}
</style>
