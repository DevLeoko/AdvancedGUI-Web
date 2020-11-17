<template>
  <div id="settings">
    <div id="generalSettings" v-if="selected">
      <div class="settings-box gen-box">
        <h1>
          <span
            class="material-icons"
            @click="devMode.value = !devMode.value"
            >{{ devMode.value ? "code" : "tune" }}</span
          >
          General settings
        </h1>
        <div class="settings-row">
          <span class="label">Name</span>
          <input type="text" v-model="selected.component.name" />
        </div>
        <div class="settings-row id-box">
          <span class="label">ID</span>
          <input
            type="text"
            :value="selected.component.id"
            @input="
              !devMode.value
                ? ($refs.idInput.value = selected.component.id)
                : (selected.component.id = $refs.idInput.value)
            "
            ref="idInput"
          />
          <span class="material-icons" @click="copyID()" ref="copyIcon"
            >content_copy</span
          >
        </div>
        <div class="settings-row" v-if="selected.component.hideable">
          <span class="label">Visibility</span>
          <input
            type="checkbox"
            :checked="invisible.indexOf(selected.component.id) == -1"
            @change="toggleVis(selected.component.id)"
          />
        </div>
      </div>
      <template v-if="selected.component.actionable">
        <div class="divider"></div>
        <div class="settings-box clickActions">
          <h1><span class="material-icons">touch_app</span> Click Action</h1>
          <component-list
            root
            :components="selected.component.clickAction"
            :modelValue="selected.action"
            @update:modelValue="val => (selected.action = val.value)"
            @copy="val => (copiedAction = val)"
          ></component-list>
          <div class="settings-row">
            <div class="btn addAction" @click="ev => showActionAddMenu(ev)">
              <span class="material-icons">add</span>
              <span class="text">Add action</span>

              <div class="absoluteMenu" ref="actionAddMenu">
                <template v-if="copiedAction">
                  <div class="entry" @click.stop="pasteAction()">
                    <span class="material-icons">content_paste</span>
                    Paste
                  </div>
                  <div class="divider"></div>
                </template>
                <div v-for="(key, index) in Object.keys(actions)" :key="index">
                  <div class="divider" v-if="index != 0"></div>
                  <div class="entry" @click.stop="addNewAction(key)">
                    <span class="material-icons">{{ actions[key].icon }}</span>
                    {{ key }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selected && selected.action" id="actionEditor">
            <h2>
              <span class="material-icons">edit</span> Edit
              {{ selected.action.id.toLowerCase() }}
            </h2>
            <component
              v-bind:is="actions[selected.action.id].component"
              :action="
                selected.action.isCheck()
                  ? selected.action.check
                  : selected.action
              "
            ></component>
          </div>
        </div>
      </template>
      <div class="divider"></div>
      <div class="settings-box">
        <h1>
          <span class="material-icons">{{ selected.component.icon }}</span>
          {{ selected.component.displayName }}
        </h1>
        <component
          v-bind:is="selected.component.vueComponent"
          :component="selected.component"
          :maxWidth="settings.width * 128"
          :maxHeight="settings.height * 128"
        ></component>
      </div>
    </div>
    <div v-else class="settings-box">
      <h1>
        <b class="label">no component selected</b>
      </h1>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { GeneralSettings } from "@/App.vue";
import { Selection } from "@/utils/Selection";
import { actions, actionFromJson } from "@/utils/manager/ActionManager";
import ComponentList from "@/components/ComponentList.vue";

import { toggleVis, invisible } from "@/utils/manager/ComponentManager";

export default defineComponent({
  props: {
    selected: {
      type: Object as () => Selection,
      required: false
    },
    settings: {
      type: Object as () => GeneralSettings,
      required: true
    },
    devMode: {
      type: Object as () => { value: boolean },
      required: true
    }
  },

  components: { ComponentList },

  data() {
    return {
      copiedAction: null as null | string,
      actions,
      toggleVis,
      invisible
    };
  },

  mounted() {
    document.addEventListener("click", this.checkClose, { capture: true });
  },

  unmounted() {
    document.removeEventListener("click", this.checkClose, { capture: true });
  },

  methods: {
    addNewAction(key: string) {
      if (this.selected) {
        const nAction = actions[key].generator(this.selected.component);
        this.selected.component.clickAction.push(nAction);
        this.selected.action = nAction;
      }
    },

    pasteAction() {
      if (this.selected && this.copiedAction) {
        const nAction = actionFromJson(JSON.parse(this.copiedAction));
        this.selected.component.clickAction.push(nAction);
        this.selected.action = nAction;
      }
    },

    showActionAddMenu(ev: MouseEvent) {
      const menu = this.$refs.actionAddMenu as HTMLElement;
      menu.style.display = "block";
      setTimeout(() => {
        menu.style.top = ev.y + 10 + "px";
        menu.style.left = ev.x - menu.offsetWidth / 2 + "px";
      }, 10);
    },

    checkClose(ev: MouseEvent) {
      const menuAction = this.$refs.actionAddMenu as HTMLElement;
      if (menuAction && ev.target != menuAction)
        menuAction.style.display = "none";
    },

    copyID() {
      const input = this.$refs.idInput as HTMLInputElement;
      const icon = this.$refs.copyIcon as HTMLElement;

      input.select();
      input.setSelectionRange(0, 99999);
      document.execCommand("copy");

      icon.innerText = "assignment_turned_in";

      setTimeout(() => (icon.innerText = "content_copy"), 1000);
    }
  }
});
</script>

<style lang="scss" scoped></style>
