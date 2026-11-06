import { Effect } from "../effect";
import { GetId } from "../id";
import { ButtonView } from "./button";
import { LabelView } from "./label";
import { ViewBase } from "./view_base";

export class WidgetTopBarView extends ViewBase {
  private _label: LabelView;
  private _collapse_button: ButtonView;
  private _close_button: ButtonView;

  constructor(id: number) {
    super(id, "div");
    this._label = new LabelView(GetId());
    this._collapse_button = new ButtonView(GetId(), "collapse-button", "_");
    this._close_button = new ButtonView(GetId(), "close-button", "X");

    this.addChild(this._label);
    this.addChild(this._collapse_button);
    this.addChild(this._close_button);

    this._label.addEffect(new Effect("topbar-label"));

    this.addEffect(new Effect("topbar"));
  }

  addOnLabelChangeHandler(handler: (new_text: string) => void) {
    this._label.addInputChangeHandler(handler);
  }

  addOnCollapseButtonClickedHandler(handler: () => void) {
    this._collapse_button.addOnClickHandler(handler);
  }

  addOnCloseButtonClickedHandler(handler: () => void) {
    this._close_button.addOnClickHandler(handler);
  }
}
