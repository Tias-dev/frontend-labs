import { Effect } from "../effect";
import { ViewBase } from "./view_base";

export class ButtonView extends ViewBase {
  private _handlers: (() => void)[] = [];
  protected _name: string;
  protected _text: string;

  constructor(id: number, name: string, text: string = "") {
    super(id, "button");

    this._name = name;
    this._text = text;

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
    result.append(this._text);

    return result;
  }
}
