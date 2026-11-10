import { Effect } from "../effect";
import { Event as CustomEvent } from "../event";
import { GetId } from "../id";
import { Button } from "./button";
import { ModalWindow } from "./modal";
import { Select } from "./select";
import { Title } from "./title";
import { Tool } from "./tool";
import { ViewBase } from "./view_base";

class AddWidgetForm extends ViewBase {
  private _onCloseEvent: CustomEvent<void>;
  private _widget_selecter: Select;
  private _column_selecter: Select;

  constructor(id: number, dashboard_columns: number) {
    super(id, "div");
    this._onCloseEvent = new CustomEvent<void>();
    this.addEffect(new Effect("add-widget-form"));

    this._widget_selecter = new Select(
      GetId(),
      ["note", "counter", "histogram", "todo"],
      ["Note", "Counter", "Histogram", "Todo list"],
    );
    this._widget_selecter.addEffect(new Effect("widget-selector"));
    const sumbit_button = new Button(GetId(), "select-widget-button", "Sumbit");
    let columns = [];
    for (let i = 1; i <= dashboard_columns; ++i) {
      columns.push(String(i));
    }

    this._column_selecter = new Select(GetId(), columns, columns);

    sumbit_button.addOnClickHandler(() => {
      this._onCloseEvent.invoke();
    });

    this.addChild(this._widget_selecter);
    this.addChild(new Title(GetId(), "Select dashboard column", 6));
    this.addChild(this._column_selecter);
    this.addChild(sumbit_button);
  }

  addOnCloseWantsHandler(handler: () => void) {
    this._onCloseEvent.addHandler(handler);
  }

  widget(): string {
    return this._widget_selecter.choice();
  }

  column(): number {
    const number = Number(this._column_selecter.choice());
    if (number < 1 && number > 3) {
      alert(
        "Expected number in [1, 3] range but current column number is " +
          number,
      );
      return 1;
    }

    return number;
  }
}

export class ToolBar extends ViewBase {
  private _add_widget_modal: ModalWindow;
  private _add_widget_form: AddWidgetForm;
  private _columns_amount: number;
  private _onWantAddNewWidgetEvent: CustomEvent<{
    widget: string;
    column: number;
  }>;
  private _onWantDashboardClearEvent: CustomEvent<void>;
  private _onWantColorschemeChangeEvent: CustomEvent<void>;

  constructor(id: number, columns_amount = 3) {
    super(id, "div");
    this.addEffect(new Effect("toolbar"));
    this._columns_amount = columns_amount;
    this._onWantAddNewWidgetEvent = new CustomEvent<{
      widget: string;
      column: number;
    }>();
    this._onWantDashboardClearEvent = new CustomEvent<void>();
    this._onWantColorschemeChangeEvent = new CustomEvent<void>();

    const add_widget_tool = new Tool(GetId(), "add-widget", "Add new widget");
    const reset_dashboard_tool = new Tool(
      GetId(),
      "reset-dashboard",
      "Reset dashboard(remove all widgets)",
    );
    const change_theme_tool = new Tool(
      GetId(),
      "change-theme",
      "Change theme (light/dark)",
    );

    add_widget_tool.addOnClickHandler(() => {
      this.addNewWidget();
    });

    reset_dashboard_tool.addOnClickHandler(() => {
      this.resetDashboard();
    });

    change_theme_tool.addOnClickHandler(() => {
      this.toggleTheme();
    });

    this.addChild(add_widget_tool);
    this.addChild(reset_dashboard_tool);
    this.addChild(change_theme_tool);

    this._add_widget_form = new AddWidgetForm(GetId(), this._columns_amount);
    this._add_widget_modal = new ModalWindow(
      GetId(),
      "Add new widget",
      this._add_widget_form,
    );

    this._add_widget_form.addOnCloseWantsHandler(() => {
      const widget = this._add_widget_form.widget();
      const column = this._add_widget_form.column();
      this._add_widget_modal.close();
      this._onWantAddNewWidgetEvent.invoke({ widget: widget, column: column });
    });

    this.addChild(this._add_widget_modal);
    this._add_widget_modal.addEffect(new Effect("new-widget-modal"));
  }

  addNewWidget(): void {
    this._add_widget_modal.show();
  }

  addWantNewWidgetHandler(
    handler: (data: { widget: string; column: number }) => void,
  ): void {
    this._onWantAddNewWidgetEvent.addHandler(handler);
  }

  addWantDashboardClearHandler(hanlder: () => void): void {
    this._onWantDashboardClearEvent.addHandler(hanlder);
  }

  addWantColorschemeChangeHandler(hanlder: () => void): void {
    this._onWantColorschemeChangeEvent.addHandler(hanlder);
  }

  resetDashboard(): void {
    this._onWantDashboardClearEvent.invoke();
  }

  toggleTheme(): void {
    this._onWantColorschemeChangeEvent.invoke();
  }
}
