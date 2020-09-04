<template>
  <div
    id="canvasPadding"
    @mousedown.prevent="onClickDown"
    @mouseup="onClickUp"
    @mousemove="onMove"
    @mouseleave="onClickUp"
  >
    <canvas ref="canvas" id="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Point } from "@/utils/Point";
import { ResizeIcon, Modifier, moveModifier } from "@/utils/Modifier";
import { Component } from "@/utils/components/Component";
import {
  isInvisible,
  invisible,
  components as registeredComponents
} from "@/utils/manager/ComponentManager";
import { drawSelection, getHanderAt } from "@/utils/Selection";
import { BoundingBox } from "@/utils/BoundingBox";

export default Vue.extend({
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    zoom: {
      type: Number,
      required: true
    },
    pauseRendering: {
      type: Boolean
    },
    selected: {
      type: Object as () => Component | null,
      required: false
    },
    elements: {
      type: Array as () => Component[],
      required: true
    }
  },

  data() {
    return {
      mouseDownTime: Date.now(),

      modifying: null as null | {
        modifier: Modifier;
        icon: ResizeIcon | "move";
        startPosition: Point;
        elementStartPosition: BoundingBox;
        singleAxis: boolean;
      },

      invisible,
      registeredComponents
    };
  },

  mounted() {
    this.adjustHeight();

    const canvas = (this.$refs.canvas as HTMLCanvasElement).getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    canvas.imageSmoothingEnabled = false;

    this.redraw();
  },

  watch: {
    selected: {
      deep: true,
      handler() {
        this.redraw();
      }
    },

    elements: {
      deep: true,
      handler() {
        this.redraw();
      }
    },

    zoom() {
      this.adjustHeight();
    },

    height() {
      this.adjustHeight();
      setTimeout(this.redraw, 10);
    },

    width() {
      setTimeout(this.redraw, 10);
    },

    registeredComponents() {
      if (this.selected && !this.registeredComponents[this.selected.id])
        this.$emit("select", null);

      this.redraw();
    },

    invisible() {
      this.redraw();
    },

    pauseRendering() {
      this.redraw();
    }
  },

  methods: {
    adjustHeight() {
      (this.$refs.canvas as HTMLElement).style.height = `${this.height *
        this.zoom}px`;
    },

    redraw() {
      if (this.pauseRendering) return;

      const canvas = (this.$refs.canvas as HTMLCanvasElement).getContext("2d", {
        alpha: false
      }) as CanvasRenderingContext2D;

      canvas.clearRect(0, 0, this.width, this.height);

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
          this.$emit("select", hovered);
        }

        if (!hovered) this.$emit("select", null);
      }

      if (this.selected) {
        let modifier;
        let modifierIcon: ResizeIcon | "move" = "move";
        let singleAxis = false;
        if (handler) {
          modifier = handler.modifier;
          modifierIcon = handler.icon;
          singleAxis = handler.singleAxisAction;
        } else if (this.selected.getBoundingBox().isInside(point)) {
          this.setCursor("move");
          modifier = moveModifier;
        }

        if (modifier && modifierIcon !== undefined) {
          this.modifying = {
            startPosition: point,
            icon: modifierIcon,
            elementStartPosition: this.selected.getBoundingBox(),
            modifier,
            singleAxis
          };
        }
      }

      this.redraw();
    },

    onClickUp(event: MouseEvent) {
      const point = this.getCursorPosition(event);
      const hovered = this.getElementAt(point);

      if (Date.now() - this.mouseDownTime < 200) {
        if (this.selected) {
          if (
            hovered &&
            this.containsComponentAtPoint(hovered, this.selected, point)
          )
            this.$emit("select", this.selected.refineSelection(point));
          else this.$emit("select", hovered);
        }

        this.redraw();
      }

      this.$emit("changeIndication");

      this.modifying = null;
    },

    getElementAt(point: Point) {
      return this.elements.find(element =>
        element.getBoundingBox().isInside(point)
      );
    },

    containsComponentAtPoint(
      comp: Component,
      find: Component,
      point: Point
    ): boolean {
      let lastFound = comp;

      do {
        if (lastFound == find) return true;
        comp = lastFound;
        lastFound = comp.refineSelection(point);
      } while (lastFound != comp);

      return lastFound == find;
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

        newBounds.ensureBounds(this.width, this.height);

        this.selected?.modify(newBounds, this.modifying.singleAxis);
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
        (event.clientX - rect.left) * (this.width / rect.width)
      );
      const y = Math.round(
        (event.clientY - rect.top) * (this.width / rect.width)
      );
      return new Point(x, y);
    }
  }
});
</script>

<style lang="scss" scoped></style>
