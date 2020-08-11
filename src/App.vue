<template>
  <div id="app">
    <div>
      Width: <input type="number" v-model="width" /> frames <br />
      Height: <input type="number" v-model="height" /> frames
    </div>
    <div class="row">
      <canvas
        ref="canvas"
        id="canvas"
        @mousedown="onClickDown"
        @mouseup="onClickUp"
        @mousemove="onMove"
        :width="width * 128"
        :height="height * 128"
      ></canvas>
      <component
        v-bind:is="selected ? selected.vueComponent : null"
        :component="selected"
      ></component>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Rect, GroupComponent } from "./utils/Component";
import { Point } from "./utils/Point";
import { BoundingBox } from "./utils/BoundingBox";
import { drawSelection, getHanderAt } from "./utils/Selection";
import { Modifier, ResizeIcon, moveModifier } from "./utils/Modifier";

export default Vue.extend({
  name: "App",

  data: () => {
    return {
      width: 3,
      height: 2,

      selected: null as null | Component,

      mouseDownTime: Date.now(),

      modifying: null as null | {
        modifier: Modifier;
        icon: ResizeIcon | "move";
        startPosition: Point;
        elementStartPosition: BoundingBox;
      },

      elements: [
        new Rect(10, 15, 300, 30, "blue"),
        new GroupComponent([
          new GroupComponent([
            new Rect(300, 100, 34, 23, "orange"),
            new Rect(150, 205, 37, 38, "Purple")
          ]),
          new Rect(90, 65, 67, 78, "red")
        ])
      ] as Component[]
    };
  },

  mounted() {
    this.redraw();
  },

  watch: {
    selected: {
      deep: true,
      handler() {
        this.redraw();
      }
    }
  },

  methods: {
    redraw() {
      const canvas = (this.$refs.canvas as HTMLCanvasElement).getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      canvas.clearRect(0, 0, this.width * 128, this.height * 128);

      for (let i = this.elements.length - 1; i >= 0; i--) {
        const element = this.elements[i];
        element.draw(canvas);
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

      if (Date.now() - this.mouseDownTime < 100) {
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

        this.selected!.modify(newBounds);
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
    }
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#canvas {
  border: 2px solid #2c3e50;
  // height: 1024px;
  height: 512px;
  image-rendering: pixelated;
  color: rgb(98, 96, 105);
}

.row {
  display: flex;
}
</style>
