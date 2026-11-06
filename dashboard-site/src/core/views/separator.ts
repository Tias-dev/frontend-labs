import { Effect } from "../effect";
import { ViewBase } from "./view_base";

export class HorizontalSeparatorView extends ViewBase {
  private readonly _space: number;
  constructor(id: number, space: number) {
    super(id, "div");
    this._space = space;

    this.addEffect(new Effect("horizontal-separator"));
  }

  space(): number {
    return this._space;
  }

  render(): HTMLElement {
    let result = super.render();
    result.style.marginTop = `${this._space / 2}px`;
    result.style.marginBottom = `${this._space / 2}px`;
    return result;
  }
}
