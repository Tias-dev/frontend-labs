import { Event as CustomEvent } from "../event";
import { Label } from "./label";

export class CheckBox extends Label {
  private _onClickEvent: CustomEvent<boolean>;
  protected _name: string;
  protected _value: boolean;

  constructor(id: number, name: string, value: boolean) {
    super(id, "checkbox", name);
    this._value = value;
    this._name = name;
    this._onClickEvent = new CustomEvent<boolean>();

    this.addInputChangeHandler((_) => {
      const value = (this.htmlElement() as HTMLInputElement).checked;
      this._onClickEvent.invoke(value);
    });

    (this.htmlElement() as HTMLInputElement).checked = value;
  }

  addOnCheckboxClickHandler(handler: (value: boolean) => void) {
    this._onClickEvent.addHandler(handler);
  }

  setValue(value: boolean) {
    this._value = value;
    (this.htmlElement() as HTMLInputElement).checked = value;
  }
}
