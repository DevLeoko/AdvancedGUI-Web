<template>
  <div id="app">
    <div class="head">
      <div class="input">
        <b class="label">Width</b>
        <span><input type="number" v-model="width" /> frames</span>
      </div>
      <div class="input">
        <b class="label">Height</b>
        <span><input type="number" v-model="height" /> frames</span>
      </div>
      <div>
        <b class="label">ZOOM</b>
        <select v-model.number="zoom">
          <option value="0.5">x0.5</option>
          <option value="1">x1</option>
          <option value="2">x2</option>
          <option value="4">x4</option>
        </select>
      </div>

      <div class="btn import">
        <span class="material-icons">cloud_upload</span>
        <span class="text">Import</span>
      </div>
      <div class="btn export">
        <span class="material-icons">get_app</span>
        <span class="text">Export savepoint</span>
      </div>
      <div class="btn export">
        <span class="material-icons">get_app</span>
        <span class="text">Export for usage</span>
      </div>
    </div>
    <div class="row mainSpace">
      <div id="compTree">
        <!-- TODO 1+1  -->
        <component-list
          class="sidebar"
          root
          :components="elements"
          @change="1 + 1"
          :value="selected ? selected.component : null"
          @input="
            comp => (selected = comp ? { component: comp, action: null } : null)
          "
          @copy="val => (copiedComponent = val)"
        ></component-list>

        <div class="btn" @click="ev => showCompAddMenu(ev)">
          <span class="material-icons">add</span>
          <span class="text">Add component</span>

          <div class="absoluteMenu" ref="compAddMenu">
            <template v-if="copiedComponent">
              <div class="entry" @click.stop="pasteComponent()">
                <span class="material-icons">content_paste</span>
                Paste
              </div>
              <div class="divider"></div>
            </template>
            <div
              v-for="(key, index) in Object.keys(componentInfo)"
              :key="index"
            >
              <div class="divider" v-if="index != 0"></div>
              <div class="entry" @click.stop="addNewCompoenent(key)">
                <span class="material-icons">{{
                  componentInfo[key].icon
                }}</span>
                {{ key }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="canvasContainer" @click.self="selected = null">
        <div id="canvasPadding">
          <my-canvas
            :width="width * 128"
            :height="height * 128"
            :selected="selected ? selected.component : null"
            :elements="elements"
            :zoom="zoom"
            @select="
              comp =>
                (selected = comp ? { component: comp, action: null } : null)
            "
          ></my-canvas>
        </div>
      </div>
      <div class="sidebar" id="settings">
        <div id="generalSettings" v-if="selected">
          <div class="settings-box gen-box">
            <h1><span class="material-icons">tune</span> General settings</h1>
            <div class="settings-row">
              <span class="label">Name</span>
              <input type="text" v-model="selected.component.name" />
            </div>
            <div class="settings-row id-box">
              <span class="label">ID</span>
              <input
                type="text"
                :value="selected.component.id"
                @input="$refs.idInput.value = selected.component.id"
                ref="idInput"
              />
              <span class="material-icons" @click="copyID()" ref="copyIcon"
                >content_copy</span
              >
            </div>
            <div class="settings-row">
              <span class="label">Visibility</span>
              <input type="checkbox" />
            </div>
          </div>
          <div class="divider"></div>
          <div class="settings-box clickActions">
            <h1><span class="material-icons">touch_app</span> Click Action</h1>
            <component-list
              class="sidebar"
              root
              :components="selected.component.clickAction"
              v-model="selected.action"
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
                  <div
                    v-for="(key, index) in Object.keys(actions)"
                    :key="index"
                  >
                    <div class="divider" v-if="index != 0"></div>
                    <div class="entry" @click.stop="addNewAction(key)">
                      <span class="material-icons">{{
                        actions[key].icon
                      }}</span>
                      {{ key }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selected && selected.action" id="actionEditor">
              <h2>
                <span class="material-icons">edit</span> Edit
                {{ selected.action.id.toLowerCase() }} action
              </h2>
              <component
                v-bind:is="actions[selected.action.id].component"
                :action="selected.action"
              ></component>
            </div>
          </div>
          <div class="divider"></div>
          <div class="settings-box">
            <h1>
              <span class="material-icons">{{ selected.component.icon }}</span>
              {{ selected.component.displayName }}
            </h1>
            <component
              v-bind:is="selected.component.vueComponent"
              :component="selected.component"
              :maxWidth="width * 128"
              :maxHeight="height * 128"
            ></component>
          </div>
        </div>
        <div v-else class="settings-box">
          <h1>
            <b class="label">no component selected</b>
          </h1>
        </div>
      </div>
    </div>
    <div ref="imageContainer" style="display:none"></div>
  </div>
</template>

<script lang="ts">
import ComponentList from "./components/ComponentList.vue";
import MyCanvas from "./components/Canvas.vue";
import Vue from "vue";
import { Component } from "./utils/Component";
import {
  componentInfo,
  componentFromJson,
  registerComponent
} from "./utils/ComponentManager";
import { actions, actionFromJson } from "./utils/ActionManager";
import { setupImageManager } from "./utils/ImageManager";
import { Action } from "./utils/Action";

export default Vue.extend({
  name: "App",
  components: { ComponentList, MyCanvas },

  data: () => {
    return {
      width: 3,
      height: 2,
      zoom: 2,

      selected: null as null | { component: Component; action: Action | null },

      componentInfo,
      actions,

      setupImageManager,

      copiedComponent: null as null | string,
      copiedAction: null as null | string,

      elements: [
        // new Rect("Blue Rect", [], 10, 15, 300, 30, "#22a7f0"),
        // new GroupComponent(
        //   "Main Group",
        //   [],
        //   [
        //     new GroupComponent(
        //       "Group 2",
        //       [],
        //       [
        //         new Rect("Orange", [], 300, 100, 34, 23, "#f2784b"),
        //         new Rect("Rect 2", [], 150, 205, 37, 38, "#5333ed")
        //       ]
        //     ),
        //     new Rect("Component", [], 90, 65, 67, 78, "#f64747")
        //   ]
        // )
      ] as Component[]
    };
  },

  mounted() {
    document.addEventListener("click", this.checkClose, { capture: true });
    this.setupImageManager(this.$refs.imageContainer as HTMLElement);
  },

  destroyed() {
    document.removeEventListener("click", this.checkClose, { capture: true });
  },

  methods: {
    showActionAddMenu(ev: MouseEvent) {
      const menu = this.$refs.actionAddMenu as HTMLElement;
      menu.style.top = ev.y + "px";
      menu.style.left = ev.x + "px";
      menu.style.display = "block";
    },

    addNewAction(key: string) {
      if (this.selected) {
        const nAction = actions[key].generator(this.selected.component);
        this.selected.component.clickAction.push(nAction);
        this.selected.action = nAction;
      }
    },

    addNewCompoenent(key: string) {
      const nComp = componentInfo[key].generator();
      registerComponent(nComp);

      this.elements.splice(0, 0, nComp);
      this.selected = {
        component: nComp,
        action: null
      };
      const menu = this.$refs.compAddMenu as HTMLElement;
      menu.style.display = "none";
    },

    checkClose(ev: MouseEvent) {
      const menuComp = this.$refs.compAddMenu as HTMLElement;
      if (ev.target != menuComp) menuComp.style.display = "none";

      const menuAction = this.$refs.actionAddMenu as HTMLElement;
      if (menuAction && ev.target != menuAction)
        menuAction.style.display = "none";
    },

    showCompAddMenu(ev: MouseEvent) {
      const menu = this.$refs.compAddMenu as HTMLElement;
      menu.style.top = ev.y + "px";
      menu.style.left = ev.x + "px";
      menu.style.display = "block";
    },

    pasteAction() {
      if (this.selected && this.copiedAction) {
        const nAction = actionFromJson(JSON.parse(this.copiedAction));
        this.selected.component.clickAction.push(nAction);
        this.selected.action = nAction;
      }
    },

    pasteComponent() {
      if (this.copiedComponent) {
        const nComp = componentFromJson(
          JSON.parse(this.copiedComponent),
          true
        )!;
        this.elements.splice(0, 0, nComp);
        this.selected = {
          component: nComp,
          action: null
        };
      }
    },

    copyID() {
      const input = this.$refs.idInput as HTMLInputElement;
      const icon = this.$refs.copyIcon as HTMLElement;

      input.select();
      input.setSelectionRange(0, 99999);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.execCommand("copy");

      icon.innerText = "assignment_turned_in";
    }
  }
});
</script>

<style lang="scss">
@import "@/scss/app.scss";
</style>
