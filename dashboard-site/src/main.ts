import { GetId } from "./core/id";
import { DashboardView } from "./core/views/dashboard";
import { HorizontalSeparatorView } from "./core/views/separator";
import { ToolView } from "./core/views/tool";
import { ToolBarView } from "./core/views/toolbar";
import { Note } from "./core/widgets/note";
import "./style.css";

let dashboard = new DashboardView(GetId(), 3);
let spacer = new HorizontalSeparatorView(GetId(), 20);
let toolbar = new ToolBarView(GetId(), [
  new ToolView(GetId(), "add-widget", "Add new widget"),
  new ToolView(
    GetId(),
    "reset-dashboard",
    "Reset dashboard(remove all widgets)",
  ),
  new ToolView(GetId(), "change-theme", "Change theme (light/dark)"),
]);

let note1 = new Note(GetId());
let note2 = new Note(GetId());
let note3 = new Note(GetId());
let note4 = new Note(GetId());

dashboard.addColumnWidget(0, note1);
dashboard.addColumnWidget(0, note4);
dashboard.addColumnWidget(1, note2);
dashboard.addColumnWidget(2, note3);

const app = document.querySelector<HTMLDivElement>("#app");

app.append(toolbar.render(), spacer.render(), dashboard.render());
