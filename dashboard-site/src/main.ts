import { GetId } from "./core/id";
import { LoadState, SaveState } from "./core/state-saver";
import { ThemeSwitcher } from "./core/theme-switcher";
import { Dashboard } from "./core/views/dashboard";
import { HorizontalSeparator } from "./core/views/separator";
import { ToolBar } from "./core/views/toolbar";
import { Counter } from "./core/widgets/counter";
import { Histogram } from "./core/widgets/histogram";
import { Note } from "./core/widgets/note";
import { TodoList } from "./core/widgets/todo";
import type { Widget } from "./core/widgets/widget";
import "./style.css";

const colunms_amount = 3; // TODO: add columns calc

let dashboard = LoadState();
if (dashboard == null) {
  dashboard = new Dashboard(GetId(), colunms_amount);
}

let spacer = new HorizontalSeparator(GetId(), 20);
let toolbar = new ToolBar(GetId(), 3);
const theme_switcher = new ThemeSwitcher();

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

toolbar.addWantDashboardClearHandler(() => {
  dashboard.clear();
});

toolbar.addWantColorschemeChangeHandler(() => {
  theme_switcher.toogleTheme();
});

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function startSaveLoop(): Promise<void> {
  let isRunning = true;

  while (isRunning) {
    try {
      console.log(`[${new Date().toISOString()}] Starting state saving...`);

      SaveState(dashboard);
    } catch (error) {
      console.error("Task failed, but the cycle will continue:", error);
    }

    // Wait 5 seconds before running the next cycle
    await delay(60000);
  }
}

startSaveLoop();

const app = document.querySelector<HTMLDivElement>("#app");

app.append(toolbar.render(), spacer.render(), dashboard.render());
