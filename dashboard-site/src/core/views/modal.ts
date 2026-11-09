import { GetId } from "../id";
import { Title } from "./title";
import { ViewBase } from "./view_base";

export class ModalWindow extends ViewBase {
  constructor(id: number, title: string, form: ViewBase) {
    super(id, "dialog");

    this.addChild(new Title(GetId(), title, 2));
    this.addChild(form);
  }

  show(): void {
    (this.htmlElement() as HTMLDialogElement).showModal();
  }

  close(): void {
    (this.htmlElement() as HTMLDialogElement).close();
  }
}
