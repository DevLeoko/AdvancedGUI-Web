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
import { defineComponent } from "vue";
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
import { images, regImages } from "@/utils/manager/ImageManager";
import { ListItemGroup } from "../utils/ListItem";
import { devMode } from "../App.vue";

let redrawFunction: Function = () => {
  // Initialized later
};

export function requestRedraw() {
  redrawFunction();
}

export default defineComponent({
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
      registeredComponents,
      images,
      regImages,

      devMode
    };
  },

  mounted() {
    this.adjustHeight();

    redrawFunction = this.redraw;

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

    regImages: {
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
        this.$emit("select", { value: null });

      this.redraw();
    },

    invisible: {
      deep: true,
      handler() {
        this.redraw();
      }
    },

    pauseRendering() {
      this.redraw();
    },

    "devMode.value": {
      handler() {
        this.redraw();
      }
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

      if (this.selected && this.registeredComponents[this.selected.id])
        drawSelection(canvas, this.selected);

      if (devMode.value) {
        canvas.strokeStyle = "rgba(255,255,255,0.3)";
        canvas.setLineDash([]);
        canvas.lineWidth = 1;
        canvas.beginPath();
        for (let lineX = 128; lineX < this.width; lineX += 128) {
          canvas.moveTo(lineX - 0.5, 0);
          canvas.lineTo(lineX - 0.5, this.height);
        }
        for (let lineY = 128; lineY < this.height; lineY += 128) {
          canvas.moveTo(0, lineY - 0.5);
          canvas.lineTo(this.width, lineY - 0.5);
        }
        canvas.stroke();
      }
    },

    getLowestCommonParents(
      comp: Component,
      targetId: string,
      point: Point
    ): (ListItemGroup<Component> & Component) | undefined {
      if (comp.isGroup()) {
        if (comp.getItems().some(c => c.id == targetId)) return comp;
        else
          return comp
            .getItems()
            .filter(c => c.getBoundingBox().isInside(point))
            .map(c => this.getLowestCommonParents(c, targetId, point))
            .find(c => !!c);
      }

      return undefined;
    },

    onClickDown(event: MouseEvent) {
      const point = this.getCursorPosition(event);
      const handler = getHanderAt(point);
      let hovered = this.getElementAt(point);

      if (!handler) {
        if (this.selected && this.selected.getBoundingBox().isInside(point))
          this.mouseDownTime = Date.now();

        // Check for change of selection
        if (
          hovered &&
          (!this.selected || !this.selected.getBoundingBox().isInside(point))
        ) {
          // If there is already an element selected, then the new selection will try to be as low as possible
          // in the component tree towards the current selection. e.g.: it will try to select sibilings within the parent
          if (this.selected) {
            const commonParent = this.getLowestCommonParents(
              hovered,
              this.selected.id,
              point
            );
            const sibling = commonParent
              ?.getItems()
              ?.find(c => c.getBoundingBox().isInside(point));

            if (sibling) hovered = sibling;
            else if (commonParent) hovered = commonParent;
          }

          this.$emit("select", { value: hovered });
        }

        if (!hovered) this.$emit("select", { value: null });
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
            this.$emit("select", {
              value: this.selected.refineSelection(point)
            });
          else this.$emit("select", { value: hovered });
        }

        this.redraw();
      }

      this.$emit("change-indication");

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
