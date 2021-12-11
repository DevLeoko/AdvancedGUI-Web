<template>
  <div id="visCheckSettings">
    <div class="settings-row">
      <span class="label">List ID</span>
      <input
        type="text"
        ref="test"
        class="componentIdInput"
        @focus="idWatcher = val => (action.targetId = val)"
        v-model="action.targetId"
      />
    </div>
    <p
      class="label"
      :class="
        components[action.targetId] &&
        components[action.targetId].displayName == 'List'
          ? ''
          : 'red-text'
      "
    >
      TARGET{{
        !components[action.targetId]
          ? " NOT FOUND!"
          : components[action.targetId].displayName != "List"
          ? " is not a list"
          : ": " + components[action.targetId].name
      }}
    </p>
    <div class="settings-row">
      <span class="label">Check if there is a </span>
      <select v-model="action.forward" style="margin-right: 8px">
        <option :value="true">next</option>
        <option :value="false">previous</option>
      </select>
      <span class="label">page</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { components } from "@/utils/manager/ComponentManager";
import { ListNextCheck } from "@/utils/checks/ListNextCheck";
import { idWatcher } from "@/utils/manager/WorkspaceManager";
import { vueRef } from "../../../utils/VueRef";

export default defineComponent({
  data() {
    return {
      components,
      idWatcher: vueRef(idWatcher)
    };
  },

  props: {
    action: {
      type: Object as () => ListNextCheck,
      required: true
    }
  }
});
</script>
