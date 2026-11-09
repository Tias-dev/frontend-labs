import { Effect } from "../effect";
import { Button } from "./button";

export class Tool extends Button {
  private readonly _hoverText: string;

  constructor(id: number, name: string, hoverText: string) {
    super(id, name);
    this._hoverText = hoverText;

    this.addEffect(new Effect(`tool-item`));
    this.addEffect(new Effect(`tool-${name}`));

    this.addOnClickHandler(() => {
      console.log(`Clicked on tool ${this._name}`);
    });
  }

  hoverText(): string {
    return this._hoverText;
  }

  render(): HTMLElement {
    let result = super.render();
    result.setAttribute("title", this._hoverText);
    return result;
  }
}
