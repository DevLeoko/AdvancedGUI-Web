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
        <select v-model="zoom">
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
        <component-list
          class="sidebar"
          root
          :components="elements"
          @change="redraw()"
          v-model="selected"
        ></component-list>

        <div class="btn" @click="ev => showCompAddMenu(ev)">
          <span class="material-icons">add</span>
          <span class="text">Add component</span>

          <div class="absoluteMenu" ref="compAddMenu">
            <div v-for="(key, index) in Object.keys(generators)" :key="index">
              <div class="divider" v-if="index != 0"></div>
              <div
                class="entry"
                @click.stop="addNewCompoenent(key)"
                :key="index"
              >
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
          <canvas
            ref="canvas"
            id="canvas"
            @mousedown="onClickDown"
            @mouseup="onClickUp"
            @mousemove="onMove"
            @mouseleave="onClickUp"
            :width="width * 128"
            :height="height * 128"
          ></canvas>
        </div>
      </div>
      <div class="sidebar" id="settings">
        <div id="generalSettings" v-if="selected">
          <div class="settings-box">
            <h1><span class="material-icons">tune</span> General settings</h1>
            <div class="settings-row">
              <b class="label">Component ID</b>
              <input type="text" v-model="selected.id" />
            </div>
            <div class="settings-row">
              <b class="label">Visibility</b>
              <input type="checkbox" />
            </div>
          </div>
          <div class="divider"></div>
          <div class="settings-box">
            <h1><span class="material-icons">touch_app</span> Click Action</h1>
            <div class="settings-row">
              <div class="btn" @click="ev => showActionAddMenu(ev)">
                <span class="material-icons">add</span>
                <span class="text">Add action</span>

                <div class="absoluteMenu" ref="actionAddMenu">
                  <div
                    v-for="(key, index) in Object.keys(actions)"
                    :key="index"
                  >
                    <div class="divider" v-if="index != 0"></div>
                    <div
                      class="entry"
                      @click.stop="addNewAction(key)"
                      :key="index"
                    >
                      <span class="material-icons">{{
                        actions[key].icon
                      }}</span>
                      {{ key }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="divider"></div>
        </div>
        <div v-else class="settings-box">
          <h1>
            <b class="label">no component selected</b>
          </h1>
        </div>
        <component
          v-bind:is="selected ? selected.vueComponent : null"
          :component="selected"
        ></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ComponentList from "./components/ComponentList.vue";
import Vue from "vue";
import { Component } from "./utils/Component";
import { GroupComponent } from "./utils/components/GroupComponent";
import { Rect } from "./utils/components/Rect";
import { Point } from "./utils/Point";
import { BoundingBox } from "./utils/BoundingBox";
import { drawSelection, getHanderAt } from "./utils/Selection";
import { Modifier, ResizeIcon, moveModifier } from "./utils/Modifier";
import {
  isInvisible,
  generators,
  componentInfo
} from "./utils/ComponentManager";
import { actions } from "./utils/ActionManager";

export default Vue.extend({
  name: "App",
  components: { ComponentList },

  data: () => {
    return {
      width: 3,
      height: 2,
      zoom: 1,

      selected: null as null | Component,

      mouseDownTime: Date.now(),

      modifying: null as null | {
        modifier: Modifier;
        icon: ResizeIcon | "move";
        startPosition: Point;
        elementStartPosition: BoundingBox;
      },

      generators,
      componentInfo,
      actions,

      elements: [
        new Rect("Blue Rect", [], 10, 15, 300, 30, "blue"),
        new GroupComponent(
          "Main Group",
          [],
          [
            new GroupComponent(
              "Group 2",
              [],
              [
                new Rect("Orange", [], 300, 100, 34, 23, "orange"),
                new Rect("Rect 2", [], 150, 205, 37, 38, "Purple")
              ]
            ),
            new Rect("Component", [], 90, 65, 67, 78, "red")
          ]
        )
      ] as Component[]
    };
  },

  mounted() {
    this.redraw();
    document.addEventListener("click", this.checkClose, { capture: true });
  },

  destroyed() {
    document.removeEventListener("click", this.checkClose, { capture: true });
  },

  watch: {
    selected: {
      deep: true,
      handler() {
        this.redraw();
      }
    },

    zoom() {
      (this.$refs.canvas as HTMLElement).style.height = `${this.height *
        128 *
        this.zoom}px`;
    },

    height() {
      (this.$refs.canvas as HTMLElement).style.height = `${this.height *
        128 *
        this.zoom}px`;
      setTimeout(this.redraw, 10);
    },

    width() {
      setTimeout(this.redraw, 10);
    }
  },

  methods: {
    showActionAddMenu(ev: MouseEvent) {
      const menu = this.$refs.actionAddMenu as HTMLElement;
      menu.style.top = ev.y + "px";
      menu.style.left = ev.x + "px";
      menu.style.display = "block";
    },

    addNewAction(key: string) {
      // TODO
    },

    redraw() {
      const canvas = (this.$refs.canvas as HTMLCanvasElement).getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      canvas.clearRect(0, 0, this.width * 128, this.height * 128);

      for (let i = this.elements.length - 1; i >= 0; i--) {
        const element = this.elements[i];
        if (!isInvisible(element.id)) element.draw(canvas);
      }

      if (this.selected) drawSelection(canvas, this.selected);
    },

    onClickDown(event: MouseEvent) {
      const point = this.getCursorPosition(event);
      const handler = getHanderAt(point);
      const hovered = this.getElementAt(point);

      if (!handler) {
        if (this.selected && this.selected.getBoundingBox().isInside(point))
          this.mouseDownTime = Date.now();

        // Check for change of selection
        if (
          hovered &&
          (!this.selected || !this.selected.getBoundingBox().isInside(point))
        ) {
          this.selected = hovered;
        }

        if (!hovered) this.selected = null;
      }

      if (this.selected) {
        let modifier;
        let modifierIcon: ResizeIcon | "move" = "move";
        if (handler) {
          modifier = handler.modifier;
          modifierIcon = handler.icon;
        } else if (this.selected.getBoundingBox().isInside(point)) {
          this.setCursor("move");
          modifier = moveModifier;
        }

        if (modifier && modifierIcon !== undefined) {
          this.modifying = {
            startPosition: point,
            icon: modifierIcon,
            elementStartPosition: this.selected.getBoundingBox(),
            modifier
          };
        }
      }

      this.redraw();
    },

    onClickUp(event: MouseEvent) {
      const point = this.getCursorPosition(event);

      if (Date.now() - this.mouseDownTime < 200) {
        if (this.selected) this.selected = this.selected.refineSelection(point);

        this.redraw();
      }

      this.modifying = null;
    },

    getElementAt(point: Point) {
      return this.elements.find(element =>
        element.getBoundingBox().isInside(point)
      );
    },

    setCursor(style: "move" | "default" | "pointer" | "move" | ResizeIcon) {
      (this.$refs.canvas as HTMLElement).style.cursor = style;
    },

    onMove(event: MouseEvent) {
      const point = this.getCursorPosition(event);

      const hovered = this.getElementAt(point);

      if (this.modifying) {
        this.setCursor(this.modifying.icon);

        const xOff = point.x - this.modifying.startPosition.x;
        const yOff = point.y - this.modifying.startPosition.y;

        const newBounds = this.modifying.modifier(
          new Point(xOff, yOff),
          this.modifying.elementStartPosition
        );

        newBounds.ensureBounds(this.width * 128, this.height * 128);

        this.selected?.modify(newBounds);
      } else {
        const handler = getHanderAt(point);
        if (handler && this.selected) {
          this.setCursor(handler.icon);
        } else if (hovered) {
          if (
            hovered == this.selected ||
            this.selected?.getBoundingBox().isInside(point)
          ) {
            this.setCursor("move");
          } else this.setCursor("pointer");
        } else {
          this.setCursor("default");
        }
      }
    },

    getCursorPosition(event: MouseEvent): Point {
      const rect = (this.$refs.canvas as HTMLElement).getBoundingClientRect();
      const x = Math.round(
        (event.clientX - rect.left) * ((this.width * 128) / rect.width)
      );
      const y = Math.round(
        (event.clientY - rect.top) * ((this.width * 128) / rect.width)
      );
      return new Point(x, y);
    },

    addNewCompoenent(key: string) {
      const nComp = generators[key]();
      this.elements.splice(0, 0, nComp);
      this.selected = nComp;
      const menu = this.$refs.compAddMenu as HTMLElement;
      menu.style.display = "none";

      this.redraw();
    },

    checkClose(ev: MouseEvent) {
      const menu = this.$refs.compAddMenu as HTMLElement;
      if (ev.target != menu) menu.style.display = "none";
    },

    showCompAddMenu(ev: MouseEvent) {
      const menu = this.$refs.compAddMenu as HTMLElement;
      menu.style.top = ev.y + "px";
      menu.style.left = ev.x + "px";
      menu.style.display = "block";
    }
  }
});
</script>

<style lang="scss">
@import "@/scss/app.scss";
</style>
