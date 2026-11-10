import { Effect } from "../effect";
import { GetId } from "../id";
import { Button } from "../views/button";
import { CheckBox } from "../views/checkbox";
import { ViewBase } from "../views/view_base";
import { Widget } from "./widget";

class TodoItem extends ViewBase {
  private readonly _task: string;
  private _completed: boolean;
  private _delete_button: Button;
  private _checkbox: CheckBox;

  constructor(id: number, task: string) {
    super(id, "div");
    this._task = task;

    const task_label = new ViewBase(GetId(), "span");
    task_label.addEffect(new Effect("todo-task-label"));
    (task_label.htmlElement() as HTMLSpanElement).textContent = task;
    this._checkbox = new CheckBox(GetId(), "todo-checkbox", false);
    this._delete_button = new Button(GetId(), "todo-item-delete");

    this.addChild(task_label);
    this.addChild(this._checkbox);
    this.addChild(this._delete_button);

    this._checkbox.addOnCheckboxClickHandler((value: boolean) => {
      console.log(
        `Task: ${this._task} has changed state to: ${this._completed}`,
      );
      this._completed = value;
    });

    this.addEffect(new Effect("todo-item"));
  }

  setCompleteStatus(complete: boolean): void {
    this._completed = complete;
    this._checkbox.setValue(complete);
  }

  addOnDeleteHandler(hanler: (item: TodoItem) => void): void {
    this._delete_button.addOnClickHandler(() => hanler(this));
  }

  task(): string {
    return this._task;
  }

  completed(): boolean {
    return this._completed;
  }
}

export class TodoList extends Widget {
  private _tasks_view: ViewBase;
  constructor(id: number) {
    const todo_list_composed = new ViewBase(GetId(), "div");
    todo_list_composed.addEffect(new Effect("widget-todo"));

    const add_task_button = new Button(
      GetId(),
      "add-task-button",
      "Add new task",
    );

    add_task_button.addOnClickHandler(() => {
      this.addTask();
    });

    const todo_tasks = new ViewBase(GetId(), "div");
    todo_tasks.addEffect(new Effect("todo-tasks"));

    todo_list_composed.addChild(add_task_button);
    todo_list_composed.addChild(todo_tasks);

    super(id, todo_list_composed);
    this._tasks_view = todo_tasks;
  }

  type(): string {
    return "todo";
  }

  addTask() {
    const task_content = prompt("Input task content: ");
    if (!task_content) {
      alert("No task given, do nothing");
      return;
    }
    const task = new TodoItem(GetId(), task_content);
    this._tasks_view.addChild(task);

    task.addOnDeleteHandler((task: TodoItem) => {
      this._tasks_view.removeChild(task);
    });
  }

  saveState() {
    super.saveState();
    const data = {
      tasks: (this._tasks_view.childs() as TodoItem[]).map((item) => ({
        task: item.task(),
        completed: item.completed(),
      })),
    };

    localStorage.setItem(`todo-${this.id()}`, JSON.stringify(data));
  }

  loadState() {
    super.loadState();
    const data_string = localStorage.getItem(`todo-${this.id()}`);
    if (!data_string) {
      alert(
        "Requested widget(todo) with id: " +
          this.id() +
          " not found in local storage",
      );
      return;
    }
    const data = JSON.parse(data_string);
    (data.tasks as { task: string; completed: boolean }[]).forEach((item) => {
      const task = new TodoItem(GetId(), item.task);
      task.setCompleteStatus(item.completed);
      this._tasks_view.addChild(task);

      task.addOnDeleteHandler((task: TodoItem) => {
        this._tasks_view.removeChild(task);
      });
    });
  }
}
