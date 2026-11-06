import { Effect } from "../effect";
import { GetId } from "../id";
import { Text } from "../views/text";
import { Widget } from "./widget";

export class Note extends Widget {
  private _text: string = "";

  constructor(id: number) {
    const content = new Text(GetId());
    super(id, content);

    content.addEffect(new Effect("note-content"));
    content.addInputChangeHandler((new_text: string) => {
      this._text = new_text;
    });
  }

  text(): string {
    return this._text;
  }
}
