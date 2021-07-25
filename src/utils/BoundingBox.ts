import { devMode } from "./manager/WorkspaceManager";
import { Point } from "./Point";

export class BoundingBox {
  static EMPTY = new BoundingBox(0, 0, 0, 0);

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  isInside(point: Point): boolean {
    return (
      point.x >= this.x &&
      point.x < this.x + this.width &&
      point.y >= this.y &&
      point.y < this.y + this.height
    );
  }

  ensureBounds(width: number, height: number) {
    if (devMode.value) return;

    if (this.x == undefined) this.x = 0;
    if (this.y == undefined) this.y = 0;
    if (this.width == undefined) this.width = 0;
    if (this.height == undefined) this.height = 0;

    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;

    if (this.width <= 0) this.width = 1;
    if (this.height <= 0) this.height = 1;

    if (this.width > width) this.width = width;
    if (this.height > height) this.height = height;

    if (this.x + this.width > width) this.x = width - this.width;
    if (this.y + this.height > height) this.y = height - this.height;
  }
}
