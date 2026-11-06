import { Effect } from "../effect";
import type { Renderable } from "../interfaces/renderable";

export class ViewBase implements Renderable {
  private readonly _id: number;
  private readonly _base_element: string;
  private _effects: Effect[];
  protected _childs: ViewBase[];

  protected _html_element: HTMLElement | null = null;
  protected _display_status: string = "";
  protected _hiden: boolean = false;

  constructor(
    id: number,
    base_element: string,
    childs: ViewBase[] = [],
    effects: Effect[] = [],
  ) {
    this._id = id;
    this._base_element = base_element;
    this._childs = childs;
    this._effects = effects;
  }

  id(): number {
    return this._id;
  }

  baseElement(): string {
    return this._base_element;
  }

  htmlElement(): HTMLElement {
    if (!this._html_element) {
      this._html_element = this.render();
    }
    return this._html_element;
  }

  addEffect(effect: Effect): void {
    for (let i = 0; i < this._effects.length; ++i) {
      if (this._effects[i].id() == effect.id()) {
        return;
      }
    }
    this._effects.push(effect);
  }

  protected addEffectToAllWidgetTree(effect: Effect): void {
    this.addEffect(effect);
    for (let i = 0; i < this._childs.length; ++i) {
      this._childs[i].addEffectToAllWidgetTree(effect);
    }
  }

  removeEffect(effect: Effect): void {
    let new_effects: Effect[] = [];
    for (let i = 0; i < this._effects.length; ++i) {
      if (this._effects[i] == effect) {
        continue;
      }
      new_effects.push(this._effects[i]);
    }

    this._effects = new_effects;
    this._html_element.classList.remove(effect.toClassName());
  }

  protected removeEffectFromAllWidgetTree(effect: Effect): void {
    this.removeEffect(effect);
    for (let i = 0; i < this._childs.length; ++i) {
      this._childs[i].removeEffectFromAllWidgetTree(effect);
    }
  }

  protected addChild(
    child: ViewBase,
    after_i: number = -1,
    update_html: boolean = true,
  ): void {
    for (let i = 0; i < this._childs.length; ++i) {
      if (this._childs[i].id() == child.id()) {
        return;
      }
    }

    if (after_i < 0) {
      this._childs.push(child);
      console.log("Adding element: " + this._html_element);
      if (this._html_element && update_html) {
        this._html_element.append(child.htmlElement());
      }
      return;
    }

    if (after_i >= this._childs.length) {
      alert("Try to add widget after index out of range!");
      return;
    }

    let childs = [];
    for (let i = 0; i < this._childs.length; ++i) {
      childs.push(this._childs[i]);
      if (i == after_i) {
        childs.push(child);
        if (this._html_element && update_html) {
          if (i == this._childs.length - 1) {
            this._html_element.append(child.htmlElement());
          } else {
            this._html_element.insertBefore(
              child.htmlElement(),
              document.getElementById(`${this._childs[i]}`).nextSibling,
            );
          }
        }
      }
    }

    this._childs = childs;
  }

  containChild(id: number): boolean {
    for (let i = 0; i < this._childs.length; ++i) {
      if (this._childs[i].id() == id) {
        return true;
      }
    }
    return false;
  }

  protected removeChild(child: ViewBase): void {
    for (let i = 0; i < this._childs.length; ++i) {
      if (this._childs[i].id() == child.id()) {
        const element = document.getElementById(`${child.id()}`);
        if (element) {
          this._html_element.removeChild(element);
        }
      }
    }
    this._childs = this._childs.filter((child_) => child_.id() != child.id());
  }

  hide() {
    if (this._html_element == null) {
      console.log("Trying to hide not existing element!");
      return;
    }
    this._display_status = this._html_element.style.display;
    this._html_element.style.display = "none";
    this._hiden = true;
  }

  unhide() {
    if (this._html_element == null) {
      console.log("Trying to unhide not existing element!");
      return;
    }
    this._html_element.style.display = this._display_status;
    this._hiden = false;
  }

  hidden(): boolean {
    return this._hiden;
  }

  render(): HTMLElement {
    let result = document.createElement(this._base_element);
    result.setAttribute("id", `${this._id}`);

    result.classList.add(
      ...this._effects.map((effect) => effect.toClassName()),
    );
    if (this._childs.length > 0) {
      for (let i = 0; i < this._childs.length; ++i) {
        result.append(this._childs[i].render());
      }
    }

    this._html_element = result;
    return result;
  }
}
