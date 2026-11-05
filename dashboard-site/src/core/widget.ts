import type { Box, Point } from "./geometry";

export class Widget {
  private readonly _id: number;

  private _label: string;
  private _anchor: Point;
  private _bbox: Box;

  constructor(id: number, label: string, anchor: Point, bbox: Box) {
    this._id = id;
    this._label = label;
    this._anchor = anchor;
    this._bbox = bbox;
  }

  id(): number {
    return this._id;
  }

  label(): string {
    return this._label;
  }

  anchor(): Point {
    return this._anchor;
  }

  bbox(): Box {
    return this._bbox;
  }

  moveBy(offset: Point): void {
    this._anchor = this._anchor.shift(offset);
  }

  moveTo(new_anchor: Point): void {
    this._anchor = new_anchor;
  }
}
