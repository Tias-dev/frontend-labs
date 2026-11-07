import { Effect } from "../effect";
import { Event as CustomEvent } from "../event";
import { ViewBase } from "./view_base";

export class Label extends ViewBase {
  private _onLabelChangeEvent: CustomEvent<string>;
  constructor(id: number, type: string = "text", name: string | null = null) {
    super(id, "input");

    this._onLabelChangeEvent = new CustomEvent<string>();
    this.addEffect(new Effect("oneline-text"));
    if (name) {
      this.addEffect(new Effect(`label-${name}`));
    }

    this.htmlElement().setAttribute("type", type);
  }

  addInputChangeHandler(handler: (new_text: string) => void) {
    this._onLabelChangeEvent.addHandler(handler);
  }

  setText(new_text: string): void {
    (this.htmlElement() as HTMLInputElement).value = new_text;
  }

  protected onInputChange(e: Event): void {
    const new_text = (e.target as HTMLInputElement).value;
    console.log(`Label(${this.id()}) has been changed to ${new_text}`);
    this._onLabelChangeEvent.invoke(new_text);
  }

  render(): HTMLElement {
    let result = super.render();

    result.addEventListener("change", (e: Event) => {
      this.onInputChange(e);
    });

    return result;
  }
}
