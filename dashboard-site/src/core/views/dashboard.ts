import { Effect } from "../effect";
import { GetId } from "../id";
import { ViewBase } from "./view_base";

class DashboardColumnView extends ViewBase {
  constructor(id: number) {
    super(id, "div");
    this.addEffect(new Effect("dashboard-column"));
  }

  addWidget(widget: ViewBase) {
    super.addChild(widget);
  }
  removeWidget(widget: ViewBase) {
    super.removeChild(widget);
  }
}

export class DashboardView extends ViewBase {
  constructor(id: number, columns: number) {
    super(id, "div", []);
    for (let i = 0; i < columns; ++i) {
      this.addChild(new DashboardColumnView(GetId()));
    }
    this.addEffect(new Effect("dashboard"));
  }

  addColumnWidget(column: number, child: ViewBase): void {
    if (this._childs.length <= column) {
      alert("Trying to add widget out of columns range!");
      return;
    }
    (this._childs[column] as DashboardColumnView).addWidget(child);
  }

  removeWidget(column: number, child: ViewBase): void {
    if (this._childs.length <= column) {
      alert("Trying to add widget out of columns range!");
      return;
    }
    (this._childs[column] as DashboardColumnView).removeWidget(child);
  }
}
