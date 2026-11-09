import { Effect } from "../effect";
import { ViewBase } from "./view_base";

export class Text extends ViewBase {
  private _handlers: ((new_text: string) => void)[] = [];
  constructor(id: number) {
    super(id, "textarea");

    this.addEffect(new Effect("multiline-text"));
  }

  addInputChangeHandler(handler: (new_text: string) => void) {
    this._handlers.push(handler);
  }

  text(): string {
    return (this.htmlElement() as HTMLTextAreaElement).textContent;
  }

  setText(new_text: string): void {
    (this.htmlElement() as HTMLTextAreaElement).textContent = new_text;
  }

  protected onInputChange(e: Event): void {
    const new_text = (e.target as HTMLTextAreaElement).value;
    console.log(`Text(${this.id()}) has been changed to ${new_text}`);
    for (let i = 0; i < this._handlers.length; ++i) {
      this._handlers[i](new_text);
    }
  }

  render(): HTMLElement {
    let result = super.render();

    result.addEventListener("change", (e: Event) => {
      this.onInputChange(e);
    });

    return result;
  }
}
