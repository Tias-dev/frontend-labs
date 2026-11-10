import { Effect } from "../effect";
import { Event as CustomEvent } from "../event";
import { GetId } from "../id";
import { Counter } from "../widgets/counter";
import { Histogram } from "../widgets/histogram";
import { Note } from "../widgets/note";
import { TodoList } from "../widgets/todo";
import { Widget } from "../widgets/widget";
import { ViewBase } from "./view_base";

class DashboardColumn extends ViewBase {
  onDraggedItemHoverEvent: CustomEvent<void>;
  dragged_item: Widget | null = null;
  constructor(id: number) {
    super(id, "div");
    this.onDraggedItemHoverEvent = new CustomEvent<void>();

    this.addEffect(new Effect("dashboard-column"));
  }

  addWidget(widget: Widget, after_i: number = -1, update_html: boolean = true) {
    super.addChild(widget, after_i, update_html);
    widget.addOnDeleteHanlder(() => {
      this.removeWidget(widget);
    });
  }

  removeWidget(widget: ViewBase) {
    super.removeChild(widget);
  }

  widgets(): Widget[] {
    return this._childs as Widget[];
  }

  clearWidgets() {
    const childs = [...this._childs];
    for (let i = 0; i < childs.length; ++i) {
      this.removeChild(childs[i]);
    }
  }

  private onDraggedItemHoverHandler(event: DragEvent): void {
    this.onDraggedItemHoverEvent.invoke();
    const y = event.clientY;
    let closestChild: HTMLElement | null = null;
    let closestDistance = 1e9;
    this.htmlElement().childNodes.forEach((child_node) => {
      const child = child_node as HTMLElement;
      const bbox = child.getBoundingClientRect();
      const middle = (bbox.top + bbox.bottom) / 2;
      if (Math.abs(middle - y) < closestDistance) {
        closestChild = child;
        closestDistance = Math.abs(middle - y);
      }
    });
    if (closestChild == null) {
      this.htmlElement().append(this.dragged_item.htmlElement());
      return;
    }
    if (Number(closestChild.id) == this.dragged_item.id()) {
      return;
    }
    const closestChildBbox = closestChild.getBoundingClientRect();
    const relativeY = y - closestChildBbox.top;
    const isTopHalf = relativeY < closestChildBbox.height / 2;
    if (isTopHalf) {
      this.htmlElement().insertBefore(
        this.dragged_item.htmlElement(),
        closestChild,
      );
    } else {
      this.htmlElement().insertBefore(
        this.dragged_item.htmlElement(),
        closestChild.nextSibling,
      );
    }
    return;
  }

  render(): HTMLElement {
    const result = super.render();

    result.addEventListener("dragover", (event: DragEvent) => {
      event.preventDefault();
      result.classList.add("column-hovered");
      this.onDraggedItemHoverHandler(event);
    });
    result.addEventListener("dragleave", (_: DragEvent) => {
      result.classList.remove("column-hovered");
    });
    result.addEventListener("drop", (event: DragEvent) => {
      event.preventDefault();
      result.classList.remove("column-hovered");
    });

    return result;
  }
}

export class Dashboard extends ViewBase {
  private _dragged_widget: Widget | null = null;
  private _widgets_map: Map<number, Widget> = new Map<number, Widget>();

  constructor(id: number, columns: number) {
    super(id, "div", []);
    for (let i = 0; i < columns; ++i) {
      const column = new DashboardColumn(GetId());
      this.addChild(column);
    }
    this.addEffect(new Effect("dashboard"));
  }
  clear(): void {
    for (let i = 0; i < this._childs.length; ++i) {
      (this._childs[i] as DashboardColumn).clearWidgets();
    }
    this.resyncColumns();
  }

  saveState() {
    const data = {
      columns: this._childs.length,
      widgets: [],
    };

    (this._childs as DashboardColumn[]).forEach((column, index) => {
      column.widgets().forEach((widget) => {
        data.widgets.push({
          column_idx: index,
          widget_id: widget.id(),
          widget_type: widget.type(),
        });
        widget.saveState();
      });
    });

    localStorage.setItem(`dashboard-${this.id()}`, JSON.stringify(data));
  }

  loadState() {
    const data = JSON.parse(localStorage.getItem(`dashboard-${this.id()}`));
    if (!data) {
      console.error(`No data specified for dashboard-${this.id()}`);
      return;
    }
    const columns = data.columns;
    while (this._childs.length < columns) {
      const column = new DashboardColumn(GetId());
      this.addChild(column);
    }
    while (this._childs.length > columns) {
      this.removeChild(this._childs[-1]);
    }

    this._childs.forEach((child) => {
      (child as DashboardColumn).clearWidgets();
    });

    const widgets: {
      column_idx: number;
      widget_id: number;
      widget_type: string;
    }[] = data.widgets;
    const create_widget_from_type = (id: number, type: string) => {
      switch (type) {
        case "note":
          return new Note(id);
        case "counter":
          return new Counter(id);
        case "histogram":
          return new Histogram(id);
        case "todo":
          return new TodoList(id);
      }
    };
    console.log("Restoring " + widgets.length + " widgets");
    widgets.forEach((widget_data) => {
      const widget = create_widget_from_type(
        widget_data.widget_id,
        widget_data.widget_type,
      );
      widget.loadState();
      this.addColumnWidget(widget_data.column_idx, widget);
    });
  }

  columns(): number {
    return this._childs.length;
  }

  private onWidgetDragStart(widget: Widget, _: DragEvent) {
    this._dragged_widget = widget;
    for (let i = 0; i < this._childs.length; ++i) {
      (this._childs[i] as DashboardColumn).dragged_item = widget;
    }
    this._dragged_widget.addEffect(new Effect("dragging"));
  }

  private onWidgetDragEnd(_: Widget, __: DragEvent) {
    for (let i = 0; i < this._childs.length; ++i) {
      (this._childs[i] as DashboardColumn).dragged_item = null;
    }

    this._dragged_widget.removeEffect(new Effect("dragging"));
    this._dragged_widget = null;
    this.resyncColumns();
  }

  private onWidgetDragMove(_: Widget, __: DragEvent) {}

  private resyncColumns() {
    for (let i = 0; i < this._childs.length; ++i) {
      const column = this._childs[i] as DashboardColumn;
      const column_child_ids = [];
      column.htmlElement().childNodes.forEach((child) => {
        column_child_ids.push((child as HTMLElement).id);
      });
      column.clearWidgets();
      column_child_ids.forEach((id) => {
        column.addWidget(this._widgets_map[Number(id)], -1, true);
      });
    }
  }

  addColumnWidget(column: number, widget: Widget): void {
    if (this._childs.length <= column) {
      alert("Trying to add widget out of columns range!");
      return;
    }
    (this._childs[column] as DashboardColumn).addWidget(widget);
    this._widgets_map[widget.id()] = widget;

    widget.addDragStartHandler((data) => {
      this.onWidgetDragStart(data.widget, data.event);
    });
    widget.addDragEndHandler((data) => {
      this.onWidgetDragEnd(data.widget, data.event);
    });
    widget.addDragMoveHandler((data) => {
      this.onWidgetDragMove(data.widget, data.event);
    });
  }

  removeWidget(column: number, child: ViewBase): void {
    if (this._childs.length <= column) {
      alert("Trying to add widget out of columns range!");
      return;
    }
    (this._childs[column] as DashboardColumn).removeWidget(child);
  }
  render(): HTMLElement {
    const result = super.render();
    result.addEventListener("dragover", (event: DragEvent) => {
      this.onWidgetDragMove(this._dragged_widget, event);
    });
    return result;
  }
}
