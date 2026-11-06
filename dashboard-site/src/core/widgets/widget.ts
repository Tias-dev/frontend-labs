import { GetId } from "../id";
import { WidgetTopBarView } from "../views/widget_topbar";
import { ViewBase } from "../views/view_base";
import { Effect } from "../effect";

export class Widget extends ViewBase {
  private _label: string = "";

  private _widget_view: ViewBase | null = null;
  private _topbar: WidgetTopBarView;

  protected constructor(id: number, widget_view: ViewBase) {
    super(id, "div");
    this._widget_view = widget_view;
    this._topbar = new WidgetTopBarView(GetId());

    this.addChild(this._topbar);
    this.addChild(this._widget_view);
    this.addEffect(new Effect("widget"));

    this._topbar.addOnCloseButtonClickedHandler(() => this.delete());
    this._topbar.addOnCollapseButtonClickedHandler(() => this.collapseToggle());
    this._topbar.addOnLabelChangeHandler((new_label: string) => {
      this._label = new_label;
      console.log(`New label at widget: ${this.id()}: ${this._label}`);
    });
  }

  protected view(): ViewBase | null {
    return this._widget_view;
  }

  label(): string {
    return this._label;
  }

  delete() {
    console.log("Do delete things!");
  }

  collapseToggle() {
    if (this._widget_view.hidden()) {
      this._widget_view.unhide();
    } else {
      this._widget_view.hide();
    }
  }

  render(): HTMLElement {
    const result = super.render();

    // drag logic
    result.setAttribute("draggable", "true");
    result.addEventListener("dragstart", (event: DragEvent) => {
      if (!event.dataTransfer) {
        alert("data transfer not accessible, so drag mechanics will not work!");
        return;
      }

      event.dataTransfer.setData("text/plain", `${this.id()}`);
      result.classList.add("dragging");
    });
    result.addEventListener("dragend", (_: DragEvent) => {
      result.classList.remove("dragging");
    });

    return result;
  }
}
