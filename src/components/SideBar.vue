<template>
  <div id="settings">
    <div id="generalSettings" v-if="selection.value">
      <div class="settings-box gen-box">
        <h1>
          <span
            class="material-icons"
            style="cursor:pointer; user-select:none"
            @click.prevent="devMode = !devMode"
            >{{ devMode ? "code" : "tune" }}</span
          >
          General settings
        </h1>
        <div class="settings-row">
          <span class="label">Name</span>
          <input type="text" v-model="selection.value.component.name" />
        </div>
        <div class="settings-row id-box">
          <span class="label">ID</span>
          <input
            type="text"
            :value="selection.value.component.id"
            @input="
              !devMode
                ? ($refs.idInput.value = selection.value.component.id)
                : (selection.value.component.id = $refs.idInput.value)
            "
            ref="idInput"
          />
          <span class="material-icons" @click="copyID()" ref="copyIcon"
            >content_copy</span
          >
        </div>
        <div class="settings-row" v-if="selection.value.component.hideable">
          <span class="label">Visibility</span>
          <input
            type="checkbox"
            :checked="invisibleIDs.indexOf(selection.value.component.id) == -1"
            @change="toggleVis(selection.value.component.id)"
          />
        </div>
      </div>
      <template v-if="selection.value.component.actionable">
        <div class="divider"></div>
        <div class="settings-box clickActions">
          <h1><span class="material-icons">touch_app</span> Click Action</h1>
          <component-list
            root
            :components="selection.value.component.clickAction"
            :modelValue="selection.value.action"
            @update:modelValue="val => (selection.value.action = val.value)"
            @deleted="checkDelete"
            @copy="val => (copiedAction = val)"
            @add-child="addActionToTree"
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
                <div v-for="(key, index) in actionIDs" :key="index">
                  <div class="divider" v-if="index != 0"></div>
                  <div class="entry" @click.stop="addNewAction(key)">
                    <span class="material-icons">{{ actions[key].icon }}</span>
                    {{ key }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="selection.value && selection.value.action"
            id="actionEditor"
          >
            <h2>
              <span class="material-icons">edit</span> Edit
              {{ selection.value.action.id.toLowerCase() }}
            </h2>
            <component
              v-bind:is="actions[selection.value.action.id].component"
              :action="
                selection.value.action.isCheck()
                  ? selection.value.action.check
                  : selection.value.action
              "
            ></component>
          </div>
        </div>
      </template>
      <div class="divider"></div>
      <div class="settings-box">
        <h1>
          <span class="material-icons">{{
            selection.value.component.icon
          }}</span>
          {{ selection.value.component.displayName }}
        </h1>
        <component
          v-bind:is="selection.value.component.vueComponent"
          :component="selection.value.component"
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
import {
  actions,
  actionIDs,
  actionFromJson
} from "@/utils/manager/ActionManager";
import ComponentList from "@/components/ComponentList.vue";

import { toggleVis, invisibleIDs } from "@/utils/manager/ComponentManager";
import { Action } from "../utils/actions/Action";
import { settings } from "../utils/manager/SettingsManager";
import { devMode, selection } from "../utils/manager/WorkspaceManager";

export default defineComponent({
  components: { ComponentList },

  data() {
    return {
      settings,
      actionTarget: null as null | Action[],
      copiedAction: null as null | string,
      actions,
      actionIDs,
      toggleVis,
      invisibleIDs,
      selection,
      devMode
    };
  },

  mounted() {
    document.addEventListener("click", this.checkClose, { capture: true });
  },

  unmounted() {
    document.removeEventListener("click", this.checkClose, { capture: true });
  },

  methods: {
    checkDelete(action: Action) {
      if (action == this.selection.value?.action) {
        this.selection.value.action = null;
      }
    },

    addActionToTree(data: { event: MouseEvent; anchor: Action[] }) {
      this.showActionAddMenu(data.event, data.anchor);
    },

    addNewAction(key: string) {
      if (this.selection.value && this.actionTarget) {
        const nAction = actions[key].generator(this.selection.value.component);
        this.actionTarget.push(nAction);
        this.selection.value.action = nAction;
      }
    },

    pasteAction() {
      if (this.selection.value && this.copiedAction && this.actionTarget) {
        const nAction = actionFromJson(JSON.parse(this.copiedAction));
        this.actionTarget.push(nAction);
        this.selection.value.action = nAction;
      }
    },

    showActionAddMenu(ev: MouseEvent, target?: Action[]) {
      this.actionTarget =
        target || this.selection.value?.component.clickAction!;

      const menu = this.$refs.actionAddMenu as HTMLElement;
      menu.style.display = "block";
      setTimeout(() => {
        menu.style.top = ev.y + 10 + "px";
        menu.style.left = ev.x - menu.offsetWidth / (target ? 1 : 2) + "px";
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
