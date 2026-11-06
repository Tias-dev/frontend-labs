import { Effect } from "../effect";
import { ButtonView } from "./button";

export class ToolView extends ButtonView {
  private readonly _hoverText: string;
  private _counter: number = 0;

  constructor(id: number, name: string, hoverText: string) {
    super(id, name);
    this._hoverText = hoverText;

    this.addEffect(new Effect(`tool-item`));
    this.addEffect(new Effect(`tool-${name}`));

    this.addOnClickHandler(() => {
      console.log(`Clicked on tool ${this._name}`);
      this._counter += 1;
      this._html_element.innerHTML = `C: ${this._counter}`;
    });
  }

  hoverText(): string {
    return this._hoverText;
  }

  render(): HTMLElement {
    let result = super.render();
    result.setAttribute("title", this._hoverText);
    result.innerHTML = `C: ${this._counter}`;
    return result;
  }
}
