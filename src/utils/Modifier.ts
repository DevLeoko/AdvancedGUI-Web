import { BoundingBox } from "./BoundingBox";
import { Point } from "./Point";

const HANDLE_OFFEST = 2;

export const resizers: Resizer[] = [
  {
    //Top
    handle: (box: BoundingBox) =>
      new Point(box.x + box.width / 2, box.y - HANDLE_OFFEST),
    icon: "n-resize",
    singleAxisAction: true,
    modifier: (diff, sBox) =>
      new BoundingBox(sBox.x, sBox.y + diff.y, sBox.width, sBox.height - diff.y)
  },
  {
    //Right
    handle: (box: BoundingBox) =>
      new Point(box.x + box.width + HANDLE_OFFEST, box.y + box.height / 2),
    icon: "e-resize",
    singleAxisAction: true,
    modifier: (diff, sBox) =>
      new BoundingBox(sBox.x, sBox.y, sBox.width + diff.x, sBox.height)
  },
  {
    //Bottom
    handle: (box: BoundingBox) =>
      new Point(box.x + box.width / 2, box.y + box.height + HANDLE_OFFEST),
    icon: "n-resize",
    singleAxisAction: true,
    modifier: (diff, sBox) =>
      new BoundingBox(sBox.x, sBox.y, sBox.width, sBox.height + diff.y)
  },
  {
    //Left
    handle: (box: BoundingBox) =>
      new Point(box.x - HANDLE_OFFEST, box.y + box.height / 2),
    icon: "e-resize",
    singleAxisAction: true,
    modifier: (diff, sBox) =>
      new BoundingBox(sBox.x + diff.x, sBox.y, sBox.width - diff.x, sBox.height)
  },
  {
    //Top-Left
    handle: (box: BoundingBox) =>
      new Point(box.x - HANDLE_OFFEST, box.y - HANDLE_OFFEST),
    icon: "nw-resize",
    singleAxisAction: false,
    modifier: (diff, sBox) =>
      new BoundingBox(
        sBox.x + diff.x,
        sBox.y + diff.y,
        sBox.width - diff.x,
        sBox.height - diff.y
      )
  },
  {
    //Top-Right
    handle: (box: BoundingBox) =>
      new Point(box.x + box.width + HANDLE_OFFEST, box.y - HANDLE_OFFEST),
    icon: "ne-resize",
    singleAxisAction: false,
    modifier: (diff, sBox) =>
      new BoundingBox(
        sBox.x,
        sBox.y + diff.y,
        sBox.width + diff.x,
        sBox.height - diff.y
      )
  },
  {
    //Bottom-Right
    handle: (box: BoundingBox) =>
      new Point(
        box.x + box.width + HANDLE_OFFEST,
        box.y + box.height + HANDLE_OFFEST
      ),
    icon: "nw-resize",
    singleAxisAction: false,
    modifier: (diff, sBox) =>
      new BoundingBox(sBox.x, sBox.y, sBox.width + diff.x, sBox.height + diff.y)
  },
  {
    //Bottom-Left
    handle: (box: BoundingBox) =>
      new Point(box.x - HANDLE_OFFEST, box.y + box.height + HANDLE_OFFEST),
    icon: "ne-resize",
    singleAxisAction: false,
    modifier: (diff, sBox) =>
      new BoundingBox(
        sBox.x + diff.x,
        sBox.y,
        sBox.width - diff.x,
        sBox.height + diff.y
      )
  }
];

let shiftDown = false;
document.addEventListener("keydown", e => {
  shiftDown = e.shiftKey;
});
document.addEventListener("keyup", e => {
  shiftDown = e.shiftKey;
});

export const moveModifier: Modifier = (diff, sBox) => {
  if (shiftDown) {
    if (Math.abs(diff.x) < Math.abs(diff.y)) diff.x = 0;
    else diff.y = 0;
  }

  return new BoundingBox(
    sBox.x + diff.x,
    sBox.y + diff.y,
    sBox.width,
    sBox.height
  );
};

export type Modifier = (
  pointDifference: Point,
  startBoundBox: BoundingBox
) => BoundingBox;

export interface Resizer {
  handle: (box: BoundingBox) => Point;
  icon: ResizeIcon;
  modifier: Modifier;
  singleAxisAction: boolean;
  lastPosition?: BoundingBox;
}

export type ResizeIcon = "n-resize" | "e-resize" | "ne-resize" | "nw-resize";
