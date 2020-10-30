import { Component } from "./components/Component";
import { resizers } from "./Modifier";
import { BoundingBox } from "./BoundingBox";
import { Point } from "./Point";
import { Action } from "./actions/Action";

const HANDLE_SIZE = 4;

export type Selection = null | { component: Component; action: Action | null };

export function drawSelection(
  canvas: CanvasRenderingContext2D,
  element: Component
) {
  const box = element.getBoundingBox();

  canvas.strokeStyle = "rgba(125, 125, 125, 0.6)";
  canvas.fillStyle = "rgb(98, 96, 105)";
  canvas.lineWidth = 1;
  canvas.setLineDash([4, 6]);

  canvas.strokeRect(box.x - 1.5, box.y - 1.5, box.width + 3, box.height + 3);

  resizers.forEach(resizer => {
    if (element.resizeable) {
      const handle = resizer.handle(box);

      resizer.lastPosition = new BoundingBox(
        handle.x - HANDLE_SIZE / 2,
        handle.y - HANDLE_SIZE / 2,
        HANDLE_SIZE,
        HANDLE_SIZE
      );

      canvas.fillRect(
        handle.x - HANDLE_SIZE / 2,
        handle.y - HANDLE_SIZE / 2,
        HANDLE_SIZE,
        HANDLE_SIZE
      );
    } else {
      resizer.lastPosition = undefined;
    }
  });
}

export function getHanderAt(point: Point) {
  return resizers.find(
    resizer =>
      resizer.lastPosition != null && resizer.lastPosition.isInside(point)
  );
}
