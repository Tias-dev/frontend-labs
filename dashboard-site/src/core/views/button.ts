import { Effect } from "../effect";
import { ViewBase } from "./view_base";

export class ButtonView extends ViewBase {
  private _handlers: (() => void)[] = [];
  protected _name: string;

  constructor(id: number, name: string) {
    super(id, "button");

    this._name = name;

    this.addEffect(new Effect(`button-${name}`));
  }

  addOnClickHandler(handler: () => void) {
    this._handlers.push(handler);
  }

  protected onClick(_: Event) {
    console.log(`Clicked on button: ${this._name}`);

    for (let i = 0; i < this._handlers.length; ++i) {
      this._handlers[i]();
    }
  }

  render(): HTMLElement {
    let result = super.render();

    result.setAttribute("type", "button");
    result.addEventListener("click", (e: Event) => this.onClick(e));

    return result;
  }
}
