import { GetId } from "../id";
import { ViewBase } from "./view_base";

export class Select extends ViewBase {
  private _choice: string = "";

  constructor(id: number, opts: string[], labels: string[]) {
    if (opts.length != labels.length) {
      alert("opts length must be equal lables length");
      return;
    }
    super(id, "select");
    for (let i = 0; i < opts.length; ++i) {
      const opt = new ViewBase(GetId(), "option");
      opt.htmlElement().setAttribute("value", opts[i]);
      opt.htmlElement().innerHTML = labels[i];

      this.addChild(opt);
    }
    this._choice = opts[0];

    (this.htmlElement() as HTMLSelectElement).addEventListener(
      "change",
      (e: Event) => {
        this._choice = (e.target as HTMLSelectElement).value;
      },
    );
  }

  choice(): string {
    return this._choice;
  }
}
