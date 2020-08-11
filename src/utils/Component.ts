import { BoundingBox } from "./BoundingBox";
import { Point } from "./Point";

import RectangelEditor from "./../components/RectangleEditor.vue";
import EmptyEditor from "./../components/EmptyEditor.vue";
import { VueConstructor } from "vue/types/umd";

export abstract class Component {
  abstract draw(context: CanvasRenderingContext2D): void;
  abstract getBoundingBox(): BoundingBox;
  abstract modify(newBoundingBox: BoundingBox): void;
  abstract get vueComponent(): VueConstructor<Vue>;

  refineSelection(point: Point): Component {
    return this;
  }

  get resizeable() {
    return false;
  }
}

export abstract class Rectangular extends Component {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    super();
  }

  getBoundingBox(): BoundingBox {
    return new BoundingBox(this.x, this.y, this.width, this.height);
  }
}

export class Rect extends Rectangular {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string
  ) {
    super(x, y, width, height);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  modify(newBoundingBox: BoundingBox): void {
    this.x = newBoundingBox.x;
    this.y = newBoundingBox.y;
    this.width = newBoundingBox.width;
    this.height = newBoundingBox.height;
  }

  get resizeable() {
    return true;
  }

  get vueComponent(): VueConstructor<Vue> {
    return RectangelEditor;
  }
}

export class GroupComponent extends Component {
  constructor(public components: Component[]) {
    super();
  }

  draw(context: CanvasRenderingContext2D): void {
    for (let i = this.components.length - 1; i >= 0; i--) {
      const element = this.components[i];
      element.draw(context);
    }
  }

  getBoundingBox(): BoundingBox {
    let minX = -1,
      minY = -1,
      maxX = 0,
      maxY = 0;
    this.components.forEach(comp => {
      const cBox = comp.getBoundingBox();

      if (cBox.x < minX || minX == -1) minX = cBox.x;
      if (cBox.y < minY || minY == -1) minY = cBox.y;

      if (cBox.x + cBox.width > maxX) maxX = cBox.x + cBox.width;
      if (cBox.y + cBox.height > maxY) maxY = cBox.y + cBox.height;
    });

    return new BoundingBox(minX, minY, maxX - minX, maxY - minY);
  }

  modify(newBoundingBox: BoundingBox): void {
    const oldBox = this.getBoundingBox();
    const diffX = newBoundingBox.x - oldBox.x;
    const diffY = newBoundingBox.y - oldBox.y;

    this.components.forEach(comp => {
      const compBox = comp.getBoundingBox();
      comp.modify(
        new BoundingBox(
          compBox.x + diffX,
          compBox.y + diffY,
          compBox.width,
          compBox.height
        )
      );
    });
  }

  refineSelection(point: Point): Component {
    return (
      this.components.find(comp => comp.getBoundingBox().isInside(point)) ||
      this
    );
  }

  get vueComponent(): VueConstructor<Vue> {
    return EmptyEditor;
  }
}
