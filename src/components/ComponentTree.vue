<template>
  <div id="compTree">
    <component-list
      class="actualTree"
      root
      :components="componentTree"
      :modelValue="selectedComponent"
      @update:modelValue="val => updateSelection(val)"
      @copy="copiedComponent = $event"
      @deleted="checkDelete"
      @add-child="addChildToTreeElem"
    ></component-list>

    <div class="btn" @click="ev => showCompAddMenu(ev)">
      <span class="material-icons">add</span>
      <span class="text">Add component</span>

      <div class="absoluteMenu compAddMenu" ref="compAddMenu">
        <template v-if="copiedComponent">
          <div class="entry" @click.stop="pasteComponent()">
            <span class="material-icons">content_paste</span>
            Paste
          </div>
          <div class="divider"></div>
        </template>
        <div v-for="(key, index) in componentNames" :key="index">
          <div class="divider" v-if="index != 0"></div>
          <div class="entry" @click.stop="addNewCompoenent(key)">
            <span class="material-icons">{{ componentInfo[key].icon }}</span>
            {{ key }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Component } from "@/utils/components/Component";
import ComponentList from "@/components/ComponentList.vue";

import { registerComponent } from "@/utils/manager/ComponentManager";
import {
  componentTree,
  copiedComponent,
  pasteComponent,
  selection,
  updateSelection
} from "../utils/manager/WorkspaceManager";
import { componentInfo, componentNames } from "../utils/ComponentMeta";
import { vueRef } from "../utils/VueRef";

export default defineComponent({
  components: { ComponentList },

  data() {
    return {
      componentInfo,
      componentNames,
      componentTree: vueRef(componentTree),
      selection: vueRef(selection),
      copiedComponent: vueRef(copiedComponent),
      updateSelection,
      pasteComponent,
      addComponentAnchor: null as null | Component[]
    };
  },

  mounted() {
    document.addEventListener("click", this.checkClose, { capture: true });
  },

  unmounted() {
    document.removeEventListener("click", this.checkClose, { capture: true });
  },

  computed: {
    selectedComponent(): Component | null {
      return this.selection?.component || null;
    }
  },

  methods: {
    checkDelete(component: Component) {
      if (this.selection?.component?.id == component.id) {
        this.updateSelection({ value: null });
      }
    },

    checkClose(ev: MouseEvent) {
      const menuComp = this.$refs.compAddMenu as HTMLElement;
      if (ev.target != menuComp) menuComp.style.display = "none";
    },

    addChildToTreeElem(data: { event: MouseEvent; anchor: Component[] }) {
      this.showCompAddMenu(data.event, data.anchor);
    },

    addNewCompoenent(key: string) {
      const nComp = componentInfo[key].generator();
      registerComponent(nComp);

      this.addComponentAnchor!.splice(0, 0, nComp);
      this.updateSelection({ value: nComp });
      const menu = this.$refs.compAddMenu as HTMLElement;
      menu.style.display = "none";
    },

    showCompAddMenu(
      ev: MouseEvent,
      anchor = undefined as undefined | Component[]
    ) {
      const menu = this.$refs.compAddMenu as HTMLElement;
      menu.style.display = "block";
      menu.style.opacity = "0";
      this.addComponentAnchor = anchor || this.componentTree;

      setTimeout(() => {
        let y = ev.y;

        if (y + menu.offsetHeight > window.innerHeight)
          y = ev.y - menu.offsetHeight - 5;

        menu.style.opacity = "1";
        menu.style.top = y + "px";
        menu.style.left = ev.x + "px";
      }, 3);
    }
  }
});
</script>

<style lang="scss" scoped></style>
