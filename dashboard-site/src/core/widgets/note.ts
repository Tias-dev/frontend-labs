import { Effect } from "../effect";
import { GetId } from "../id";
import { Text } from "../views/text";
import { Widget } from "./widget";

export class Note extends Widget {
  private _text: Text;

  constructor(id: number) {
    const content = new Text(GetId());
    super(id, content);
    this._text = content;

    content.addEffect(new Effect("note-content"));
  }

  text(): string {
    return this._text.text();
  }

  saveState() {
    super.saveState();
    const data = {
      content: this.text(),
    };

    localStorage.setItem(`note-${this.id()}`, JSON.stringify(data));
  }

  loadState() {
    super.loadState();
    const data_string = localStorage.getItem(`note-${this.id()}`);
    if (!data_string) {
      alert(
        "Requested widget(note) with id: " +
          this.id() +
          " not found in local storage",
      );
      return;
    }
    const data = JSON.parse(data_string);
    this._text.setText(data.content);
  }
}
