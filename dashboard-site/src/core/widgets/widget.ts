import { GetId } from "../id";
import { WidgetTopBar } from "../views/widget_topbar";
import { ViewBase } from "../views/view_base";
import { Effect } from "../effect";
import { Event as CustomEvent } from "../event";

export abstract class Widget extends ViewBase {
  private _onDragStartEvent: CustomEvent<{ widget: Widget; event: DragEvent }>;
  private _onDragEndEvent: CustomEvent<{ widget: Widget; event: DragEvent }>;
  private _onDragMoveEvent: CustomEvent<{ widget: Widget; event: DragEvent }>;
  private _onDeleteEvent: CustomEvent<void>;

  private _label: string = "";

  private _widget_view: ViewBase | null = null;
  private _topbar: WidgetTopBar;

  protected constructor(id: number, widget_view: ViewBase) {
    super(id, "div");
    this._widget_view = widget_view;
    this._topbar = new WidgetTopBar(GetId());
    this._onDragStartEvent = new CustomEvent<{
      widget: Widget;
      event: DragEvent;
    }>();
    this._onDragEndEvent = new CustomEvent<{
      widget: Widget;
      event: DragEvent;
    }>();
    this._onDragMoveEvent = new CustomEvent<{
      widget: Widget;
      event: DragEvent;
    }>();
    this._onDeleteEvent = new CustomEvent<void>();

    this.addChild(this._topbar);
    this.addChild(this._widget_view);
    this.addEffect(new Effect("widget"));

    this._topbar.addOnCloseButtonClickedHandler(() => this.delete());
    this._topbar.addOnCollapseButtonClickedHandler(() => this.collapseToggle());
    this._topbar.addOnLabelChangeHandler((new_label: string) => {
      this._label = new_label;
    });
  }

  abstract type(): string;

  saveState() {
    const data = {
      label: this._label,
      isCollapsed: this._widget_view.hidden(),
    };

    localStorage.setItem(`widget-${this.id()}`, JSON.stringify(data));
  }

  loadState() {
    const data_string = localStorage.getItem(`widget-${this.id()}`);
    if (!data_string) {
      alert(
        "Requested widget with id: " +
          this.id() +
          " not found in local storage",
      );
      return;
    }
    const data = JSON.parse(data_string);
    console.log(this.id(), data.isCollapsed, this._widget_view.hidden());

    this._label = data.label;
    this._topbar.setLabel(this._label);

    if (data.isCollapsed != this._widget_view.hidden()) {
      console.log("Do collapsing");
      this.collapseToggle();
    }
  }

  protected view(): ViewBase | null {
    return this._widget_view;
  }

  label(): string {
    return this._label;
  }

  delete() {
    this._onDeleteEvent.invoke();
  }

  addOnDeleteHanlder(handler: () => void) {
    this._onDeleteEvent.addHandler(handler);
  }

  collapseToggle() {
    if (this._widget_view.hidden()) {
      this._widget_view.unhide();
    } else {
      this._widget_view.hide();
    }
  }

  addDragStartHandler(
    handler: (data: { widget: Widget; event: DragEvent }) => void,
  ): void {
    this._onDragStartEvent.addHandler(handler);
  }

  addDragEndHandler(
    handler: (data: { widget: Widget; event: DragEvent }) => void,
  ): void {
    this._onDragEndEvent.addHandler(handler);
  }

  addDragMoveHandler(
    handler: (data: { widget: Widget; event: DragEvent }) => void,
  ): void {
    this._onDragMoveEvent.addHandler(handler);
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
      this._onDragStartEvent.invoke({ widget: this, event: event });
    });
    result.addEventListener("dragend", (event: DragEvent) => {
      result.classList.remove("dragging");
      this._onDragEndEvent.invoke({ widget: this, event: event });
    });
    result.addEventListener("drag", (event: DragEvent) => {
      this._onDragMoveEvent.invoke({ widget: this, event: event });
    });

    return result;
  }
}
