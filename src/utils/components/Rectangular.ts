import { BoundingBox } from "../BoundingBox";
import { Component } from "../Component";
import { Action } from "../Action";

export abstract class Rectangular extends Component {
  constructor(
    public id: string,
    public clickAction: Action | null,
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    super(id, clickAction);
  }

  getBoundingBox(): BoundingBox {
    return new BoundingBox(this.x, this.y, this.width, this.height);
  }
}
