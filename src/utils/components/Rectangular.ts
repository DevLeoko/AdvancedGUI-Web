import { BoundingBox } from "../BoundingBox";
import { Component } from "./Component";
import { Action } from "../actions/Action";

export abstract class Rectangular extends Component {
  constructor(
    public id: string,
    public name: string,
    public clickAction: Action[],
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    super(id, name, clickAction);
  }

  getBoundingBox(): BoundingBox {
    return new BoundingBox(this.x, this.y, this.width, this.height);
  }
}
