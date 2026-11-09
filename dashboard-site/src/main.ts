import { GetId } from "./core/id";
import { Dashboard } from "./core/views/dashboard";
import { HorizontalSeparator } from "./core/views/separator";
import { ToolBar } from "./core/views/toolbar";
import { Counter } from "./core/widgets/counter";
import { Histogram } from "./core/widgets/histogram";
import { Note } from "./core/widgets/note";
import { TodoList } from "./core/widgets/todo";
import type { Widget } from "./core/widgets/widget";
import "./style.css";

let dashboard = new Dashboard(GetId(), 3);
let spacer = new HorizontalSeparator(GetId(), 20);
let toolbar = new ToolBar(GetId(), 3);

toolbar.addWantNewWidgetHandler((data) => {
  const widget: Widget = (() => {
    switch (data.widget) {
      case "note":
        return new Note(GetId());
      case "counter":
        return new Counter(GetId());
      case "histogram":
        return new Histogram(GetId());
      case "todo":
        return new TodoList(GetId());
    }
  })();

  dashboard.addColumnWidget(data.column - 1, widget);
});

const app = document.querySelector<HTMLDivElement>("#app");

app.append(toolbar.render(), spacer.render(), dashboard.render());
