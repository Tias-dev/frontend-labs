import { GetId } from "./core/id";
import { Dashboard } from "./core/views/dashboard";
import { HorizontalSeparator } from "./core/views/separator";
import { Tool } from "./core/views/tool";
import { ToolBar } from "./core/views/toolbar";
import { Counter } from "./core/widgets/counter";
import { Histogram } from "./core/widgets/histogram";
import { Note } from "./core/widgets/note";
import { TodoList } from "./core/widgets/todo";
import "./style.css";

let dashboard = new Dashboard(GetId(), 3);
let spacer = new HorizontalSeparator(GetId(), 20);
let toolbar = new ToolBar(GetId(), [
  new Tool(GetId(), "add-widget", "Add new widget"),
  new Tool(GetId(), "reset-dashboard", "Reset dashboard(remove all widgets)"),
  new Tool(GetId(), "change-theme", "Change theme (light/dark)"),
]);

let note1 = new Note(GetId());
let note2 = new Note(GetId());
let note3 = new Note(GetId());
let note4 = new Note(GetId());
let counter = new Counter(GetId());
let todo = new TodoList(GetId());
let histogram = new Histogram(GetId());

dashboard.addColumnWidget(0, note1);
dashboard.addColumnWidget(0, note2);
dashboard.addColumnWidget(0, note3);
dashboard.addColumnWidget(0, note4);
dashboard.addColumnWidget(1, counter);
dashboard.addColumnWidget(1, histogram);
dashboard.addColumnWidget(2, todo);

const app = document.querySelector<HTMLDivElement>("#app");

app.append(toolbar.render(), spacer.render(), dashboard.render());
