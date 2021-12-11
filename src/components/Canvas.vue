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
import { unsavedChange, updateHistory } from "../utils/manager/HistoryManager";
import { vueRef } from "../utils/VueRef";
import { updateCurrentThumbnail } from "../utils/manager/ProjectManager";

let redrawFunction: Function | null = null;

export function requestRedraw() {
  if (redrawFunction) redrawFunction();
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

      invisibleIDs: vueRef(invisibleIDs),
      selection: vueRef(selection),
      unsavedChange: vueRef(unsavedChange),
      settings,
      componentTree: vueRef(componentTree),
      registeredComponents,
      images,
      regImages,
      pauseRendering: vueRef(pauseRendering),

      devMode: vueRef(devMode),
      lastMove: Date.now(),
      lastSnap: new Date().getTime() - 1000 * 12
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

  unmounted() {
    redrawFunction = null;
  },

  computed: {
    height(): number {
      return this.settings.height * 128;
    },

    width(): number {
      return this.settings.width * 128;
    }
  },

  watch: {
    unsavedChange() {
      this.lastSnap = 0;
      this.redraw();
    },

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
        this.selection?.component &&
        !this.registeredComponents[this.selection?.component.id]
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

    devMode: {
      handler() {
        this.redraw();
      }
    }
  },

  methods: {
    adjustHeight() {
      (this.$refs.canvas as HTMLElement).style.height = `${this.height *
        this.settings.zoom}px`;
    },

    redraw() {
      if (this.pauseRendering) return;

      const canvas = (this.$refs.canvas as HTMLCanvasElement).getContext("2d", {
        alpha: false
      }) as CanvasRenderingContext2D;

      canvas.clearRect(0, 0, this.width, this.height);

      for (let i = this.componentTree.length - 1; i >= 0; i--) {
        const element = this.componentTree[i];
        if (!isInvisible(element.id)) element.draw(canvas);
      }

      if (new Date().getTime() - this.lastSnap > 1000 * 15) {
        updateCurrentThumbnail(
          (this.$refs.canvas as HTMLCanvasElement).toDataURL()
        );

        this.lastSnap = new Date().getTime();
      }

      if (
        this.selection?.component &&
        this.registeredComponents[this.selection?.component.id]
      )
        drawSelection(canvas, this.selection?.component);

      if (this.devMode) {
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
        if (
          this.selection?.component &&
          this.selection?.component.getBoundingBox().isInside(point)
        )
          this.mouseDownTime = Date.now();

        // Check for change of selection
        if (
          hovered &&
          (!this.selection?.component ||
            !this.selection?.component.getBoundingBox().isInside(point))
        ) {
          // If there is already an element selected, then the new selection will try to be as low as possible
          // in the component tree towards the current selection. e.g.: it will try to select sibilings within the parent
          if (this.selection?.component) {
            const commonParent = this.getLowestCommonParents(
              hovered,
              this.selection?.component.id,
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

      if (this.selection?.component) {
        let modifier;
        let modifierIcon: ResizeIcon | "move" = "move";
        let singleAxis = false;
        if (handler) {
          modifier = handler.modifier;
          modifierIcon = handler.icon;
          singleAxis = handler.singleAxisAction;
        } else if (this.selection?.component.getBoundingBox().isInside(point)) {
          this.setCursor("move");
          modifier = moveModifier;
        }

        if (modifier && modifierIcon !== undefined) {
          this.modifying = {
            startPosition: point,
            icon: modifierIcon,
            elementStartPosition: this.selection?.component.getBoundingBox(),
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
        if (this.selection?.component) {
          if (
            hovered &&
            this.containsComponentAtPoint(
              hovered,
              this.selection?.component,
              point
            )
          )
            updateSelection({
              value: this.selection?.component.refineSelection(point)
            });
          else updateSelection({ value: hovered! });
        }
      }

      this.redraw();
      updateHistory();

      this.modifying = null;
    },

    getElementAt(point: Point) {
      return this.componentTree.find(element =>
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
      if (this.modifying && Date.now() <= this.lastMove + 20) return;

      this.lastMove = Date.now();

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

        this.selection?.component?.modify(newBounds, this.modifying.singleAxis);
      } else {
        const handler = getHanderAt(point);
        if (handler && this.selection?.component) {
          this.setCursor(handler.icon);
        } else if (hovered) {
          if (
            hovered == this.selection?.component ||
            this.selection?.component?.getBoundingBox().isInside(point)
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
