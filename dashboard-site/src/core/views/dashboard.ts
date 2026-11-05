import { WidgetView } from "./widget_view";

export class DashboardView extends WidgetView {
  private _columns: number;
  private _widget_column: Map<number, number>; // widget id -> column

  constructor(id: number, columns: number) {
    super(id, "div", [])
    this._columns = columns;
  }

  addColumnWidget(column: number, child: WidgetView): void {
    if(this._columns <= column) {
      alert("Trying to add widget out of columns range!");
      return;
    }
    super.addChild(child);
    this._widget_column[child.id()] = column;
  }

  removeWidget(child: WidgetView): void {
    this.removeChild(child);
    this._widget_column.delete(child.id());
  }

  render(): HTMLElement {
    let result = document.createElement(this.baseElement());

    return result;
  }
}
