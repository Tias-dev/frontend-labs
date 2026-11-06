import { Effect } from "../effect";
import { ViewBase } from "./view_base";

export class LabelView extends ViewBase {
  private _handlers: ((new_text: string) => void)[] = [];
  constructor(id: number) {
    super(id, "input");

    this.addEffect(new Effect("oneline-text"));
  }

  addInputChangeHandler(handler: (new_text: string) => void) {
    this._handlers.push(handler);
  }

  protected onInputChange(e: Event): void {
    const new_text = (e.target as HTMLInputElement).value;
    console.log(`Label(${this.id()}) has been changed to ${new_text}`);
    for (let i = 0; i < this._handlers.length; ++i) {
      this._handlers[i](new_text);
    }
  }

  render(): HTMLElement {
    let result = super.render();

    result.addEventListener("change", (e: Event) => {this.onInputChange(e)});

    return result;
  }
}
