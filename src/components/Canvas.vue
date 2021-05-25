<template>
  <div
    id="canvasPadding"
    @mousedown.prevent="onClickDown"
    @mouseup="onClickUp"
    @mousemove="onMove"
    @mouseleave="onClickUp"
  >
    <canvas
      ref="canvas"
      id="canvas"
      :width="settings.width"
      :height="settings.height"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Point } from "@/utils/Point";
import { ResizeIcon, Modifier, moveModifier } from "@/utils/Modifier";
import { Component } from "@/utils/components/Component";
import {
  isInvisible,
  invisibleIDs,
  components as registeredComponents
} from "@/utils/manager/ComponentManager";
import { drawSelection, getHanderAt } from "@/utils/Selection";
import { BoundingBox } from "@/utils/BoundingBox";
import { images, regImages } from "@/utils/manager/ImageManager";
import { ListItemGroup } from "../utils/ListItem";
import { settings } from "../utils/manager/SettingsManager";
import {
  componentTree,
  devMode,
  pauseRendering,
  selection,
  updateSelection
} from "../utils/manager/WorkspaceManager";
import { updateHistory } from "../utils/manager/HistoryManager";

let redrawFunction: Function = () => {
  // Initialized later
};

export function requestRedraw() {
  redrawFunction();
}

export default defineComponent({
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

      invisibleIDs,
      selection,
      settings,
      componentTree,
      registeredComponents,
      images,
      regImages,
      pauseRendering,

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
    selection: {
      deep: true,
      handler() {
        this.redraw();
      }
    },

    componentTree: {
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

    "settings.zoom"() {
      this.adjustHeight();
    },

    "settings.height"() {
      this.adjustHeight();
      setTimeout(this.redraw, 10);
    },

    "settings.width"() {
      setTimeout(this.redraw, 10);
    },

    registeredComponents() {
      if (
        selection.value?.component &&
        !this.registeredComponents[selection.value?.component.id]
      )
        updateSelection({ value: null });

      this.redraw();
    },

    invisibleIDs: {
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
      (this.$refs.canvas as HTMLElement).style.height = `${this.settings
        .height * this.settings.zoom}px`;
    },

    redraw() {
      if (pauseRendering.value) return;

      const canvas = (this.$refs.canvas as HTMLCanvasElement).getContext("2d", {
        alpha: false
      }) as CanvasRenderingContext2D;

      canvas.clearRect(0, 0, this.settings.width, this.settings.height);

      for (let i = componentTree.value.length - 1; i >= 0; i--) {
        const element = componentTree.value[i];
        if (!isInvisible(element.id)) element.draw(canvas);
      }

      if (
        selection.value?.component &&
        this.registeredComponents[selection.value?.component.id]
      )
        drawSelection(canvas, selection.value?.component);

      if (devMode.value) {
        canvas.strokeStyle = "rgba(255,255,255,0.3)";
        canvas.setLineDash([]);
        canvas.lineWidth = 1;
        canvas.beginPath();
        for (let lineX = 128; lineX < this.settings.width; lineX += 128) {
          canvas.moveTo(lineX - 0.5, 0);
          canvas.lineTo(lineX - 0.5, this.settings.height);
        }
        for (let lineY = 128; lineY < this.settings.height; lineY += 128) {
          canvas.moveTo(0, lineY - 0.5);
          canvas.lineTo(this.settings.width, lineY - 0.5);
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
        if (
          selection.value?.component &&
          selection.value?.component.getBoundingBox().isInside(point)
        )
          this.mouseDownTime = Date.now();

        // Check for change of selection
        if (
          hovered &&
          (!selection.value?.component ||
            !selection.value?.component.getBoundingBox().isInside(point))
        ) {
          // If there is already an element selected, then the new selection will try to be as low as possible
          // in the component tree towards the current selection. e.g.: it will try to select sibilings within the parent
          if (selection.value?.component) {
            const commonParent = this.getLowestCommonParents(
              hovered,
              selection.value?.component.id,
              point
            );
            const sibling = commonParent
              ?.getItems()
              ?.find(c => c.getBoundingBox().isInside(point));

            if (sibling) hovered = sibling;
            else if (commonParent) hovered = commonParent;
          }

          updateSelection({ value: hovered });
        }

        if (!hovered) updateSelection({ value: null });
      }

      if (selection.value?.component) {
        let modifier;
        let modifierIcon: ResizeIcon | "move" = "move";
        let singleAxis = false;
        if (handler) {
          modifier = handler.modifier;
          modifierIcon = handler.icon;
          singleAxis = handler.singleAxisAction;
        } else if (
          selection.value?.component.getBoundingBox().isInside(point)
        ) {
          this.setCursor("move");
          modifier = moveModifier;
        }

        if (modifier && modifierIcon !== undefined) {
          this.modifying = {
            startPosition: point,
            icon: modifierIcon,
            elementStartPosition: selection.value?.component.getBoundingBox(),
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
        if (selection.value?.component) {
          if (
            hovered &&
            this.containsComponentAtPoint(
              hovered,
              selection.value?.component,
              point
            )
          )
            updateSelection({
              value: selection.value?.component.refineSelection(point)
            });
          else updateSelection({ value: hovered! });
        }

        this.redraw();
      }

      updateHistory();

      this.modifying = null;
    },

    getElementAt(point: Point) {
      return componentTree.value.find(element =>
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

        newBounds.ensureBounds(this.settings.width, this.settings.height);

        selection.value?.component?.modify(
          newBounds,
          this.modifying.singleAxis
        );
      } else {
        const handler = getHanderAt(point);
        if (handler && selection.value?.component) {
          this.setCursor(handler.icon);
        } else if (hovered) {
          if (
            hovered == selection.value?.component ||
            selection.value?.component?.getBoundingBox().isInside(point)
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
        (event.clientX - rect.left) * (this.settings.width / rect.width)
      );
      const y = Math.round(
        (event.clientY - rect.top) * (this.settings.width / rect.width)
      );
      return new Point(x, y);
    }
  }
});
</script>

<style lang="scss" scoped></style>
