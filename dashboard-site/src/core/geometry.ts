export class Point {
  readonly x: number;
  readonly y: number;

  constructor(x_: number, y_: number) {
    this.x = x_;
    this.y = y_;
  }

  shift(offset: Point): Point {
    return new Point(this.x + offset.x, this.y + offset.y);
  }
}

export class Box {
  readonly p1: Point; // Top left
  readonly p2: Point; // Bottom right

  constructor(p1_: Point, p2_: Point) {
    this.p1 = new Point(Math.min(p1_.x, p2_.x), Math.max(p1_.y, p2_.y));
    this.p2 = new Point(Math.max(p1_.x, p2_.x), Math.min(p1_.y, p2_.y));
  }

  width(): number {
    return Math.abs(this.p1.x - this.p2.x);
  }

  height(): number {
    return Math.abs(this.p1.y - this.p2.y);
  }
}
