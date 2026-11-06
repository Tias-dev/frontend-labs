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

  render(): HTMLElement {
    const result = super.render();

    result.addEventListener("dragover", (event: DragEvent) => {
      event.preventDefault();
      result.classList.add("column-hovered");
    });
    result.addEventListener("dragleave", (_: DragEvent) => {
      result.classList.remove("column-hovered");
    });
    result.addEventListener("drop", (event: DragEvent) => {
      event.preventDefault();
      result.classList.remove("column-hovered");
      if (!event.dataTransfer) {
        alert("data transfer not accessible, so drag mechanics will not work!");
        return;
      }

      const draggedItemId = event.dataTransfer.getData("text/plain");
      const draggedItem = document.getElementById(draggedItemId);
      if (draggedItem) {
        result.append(draggedItem);
      }
    });

    return result;
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
