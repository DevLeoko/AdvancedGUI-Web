<template>
  <div id="app">
    <div class="head">
      <div class="input">
        Width: <input type="number" v-model="width" /> frames
      </div>
      <div class="input">
        Height: <input type="number" v-model="height" /> frames
      </div>
    </div>
    <div class="row mainSpace">
      <component-list
        :components="elements"
        @removeitem="removeItem"
        v-model="selected"
      ></component-list>
      <canvas
        ref="canvas"
        id="canvas"
        @mousedown="onClickDown"
        @mouseup="onClickUp"
        @mousemove="onMove"
        :width="width * 128"
        :height="height * 128"
      ></canvas>
      <div id="sidebar">
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
import { ListItem } from "./utils/ListItem";

export default Vue.extend({
  name: "App",
  components: { ComponentList },

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
        new Rect("Blue Rect", null, 10, 15, 300, 30, "blue"),
        new GroupComponent("Main Group", null, [
          new GroupComponent("Group 2", null, [
            new Rect("Orange", null, 300, 100, 34, 23, "orange"),
            new Rect("Rect 2", null, 150, 205, 37, 38, "Purple")
          ]),
          new Rect("Component", null, 90, 65, 67, 78, "red")
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
    removeItem(item: ListItem) {
      this.elements = this.elements.filter(elem => elem != item);
      this.elements.forEach(elem => {
        if (elem.isGroup()) elem.removeItem(item);
      });
    },

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
    }
  }
});
</script>

<style lang="scss">
$darkPrimary: #1b1b22;

body {
  background-color: $darkPrimary;
  color: #eeeeee;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#canvas {
  border: 2px solid #2c3e50;
  // height: 1024px;
  height: 512px;
  image-rendering: pixelated;
}

.row {
  display: flex;
}

.mainSpace {
  justify-content: space-evenly;
}

.head {
  display: flex;
  padding: 20px 20px;

  .input {
    background-color: #393e46;
    border-radius: 5px;
    padding: 10px 20px;
    margin-right: 20px;

    input {
      background-color: transparent;
      border: none;
      width: 30px;
      text-align: right;
      color: #eeeeee;
      border-bottom: 1px solid #eeeeee;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type="number"] {
      -moz-appearance: textfield;
    }
  }
}

#sidebar {
  min-width: 25vw;
}
</style>
