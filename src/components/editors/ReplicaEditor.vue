<template>
  <div id="replicaSettings">
    <div class="settings-row">
      <span class="label">Template ID</span>
      <input
        type="text"
        class="componentIdInput"
        @focus="idWatcher = val => (component.targetId = val)"
        v-model="component.targetId"
      />
    </div>
    <p
      class="label"
      :class="
        components[component.targetId] &&
        components[component.targetId].displayName == 'Template'
          ? ''
          : 'red-text'
      "
    >
      TARGET{{
        !components[component.targetId]
          ? " NOT FOUND!"
          : components[component.targetId].displayName != "Template"
          ? " is not a Template"
          : ": " + components[component.targetId].name
      }}
    </p>
    <div class="label heading">Position</div>
    <div class="settings-row">
      <div class="input-box">
        <input type="number" v-model.number="component.position.x" />
        <span>X</span>
      </div>
      <div class="input-box">
        <input type="number" v-model.number="component.position.y" />
        <span>Y</span>
      </div>
    </div>
    <br />
    <div
      v-for="(data, i) in component.templateData"
      :key="i"
      class="settings-row"
    >
      <span class="label normalCase">#{{ data.name }} = </span>
      <input
        v-if="typeof data.value == 'number'"
        type="number"
        v-model.number="data.value"
      />
      <input v-else type="text" v-model="data.value" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Replica } from "@/utils/components/Replica";
import { components, TemplateData } from "@/utils/manager/ComponentManager";
import { idWatcher } from "@/utils/manager/WorkspaceManager";
import { vueRef } from "../../utils/VueRef";

export default defineComponent({
  data() {
    return {
      components,
      defaultData: undefined as undefined | TemplateData,
      idWatcher: vueRef(idWatcher)
    };
  },

  props: {
    component: {
      type: Object as () => Replica,
      required: true
    }
  },

  mounted() {
    this.defaultData = this.component.getTemplateDefaultData();
  },

  watch: {
    defaultData: {
      deep: true,
      handler() {
        this.updateTemplateData();
      }
    },
    "component.targetId": {
      handler() {
        this.defaultData = this.component.getTemplateDefaultData();
      }
    },
    "component.id": {
      handler() {
        this.defaultData = this.component.getTemplateDefaultData();
        this.updateTemplateData();
      }
    }
  },

  methods: {
    updateTemplateData() {
      if (!this.defaultData) return;

      for (const entry of this.defaultData) {
        if (
          !this.component.templateData.some(
            entr =>
              entr.name == entry.name && typeof entr.value == typeof entry.value
          )
        ) {
          this.component.templateData.push(JSON.parse(JSON.stringify(entry)));
        }
      }

      this.component.templateData = this.component.templateData.filter(entry =>
        this.defaultData!.some(
          entr =>
            entr.name == entry.name && typeof entr.value == typeof entry.value
        )
      );
    }
  }
});
</script>

<style lang="scss" scoped>
#replicaSettings {
  p {
    color: $light3 !important;
  }

  .normalCase {
    text-transform: none !important;
  }
}
</style>
