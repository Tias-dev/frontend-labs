import { ViewBase } from "./view_base";

export class Title extends ViewBase {
  constructor(id: number, text: string, level: number) {
    if (!(level >= 1 && level <= 6)) {
      alert("Title level must be in [1, 6] range but given level = " + level);
      return;
    }
    super(id, `h${level}`);
    this.htmlElement().innerHTML = text;
  }
}
