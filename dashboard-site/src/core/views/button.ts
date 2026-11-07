import { Effect } from "../effect";
import { Event as CustomEvent } from "../event";
import { ViewBase } from "./view_base";

export class Button extends ViewBase {
  private _onClickEvent: CustomEvent<void>;
  protected _name: string;
  protected _text: string;

  constructor(id: number, name: string, text: string = "") {
    super(id, "button");

    this._name = name;
    this._text = text;
    this._onClickEvent = new CustomEvent<void>();

    this.addEffect(new Effect(`button-${name}`));
  }

  addOnClickHandler(handler: () => void) {
    this._onClickEvent.addHandler(handler);
  }

  protected onClick(_: Event) {
    console.log(`Clicked on button: ${this._name}`);

    this._onClickEvent.invoke();
  }

  render(): HTMLElement {
    let result = super.render();

    result.setAttribute("type", "button");
    result.addEventListener("click", (e: Event) => this.onClick(e));
    result.append(this._text);

    return result;
  }
}
