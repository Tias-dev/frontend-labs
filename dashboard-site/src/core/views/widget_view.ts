import { EffectBase } from "../effects/effect_base";
import type { Renderable } from "../interfaces/renderable";

export class WidgetView implements Renderable {
  private readonly _id: number;
  private readonly _base_element: string;
  private _effects: EffectBase[];
  private _childs: WidgetView[];

  constructor(id: number, base_element: string, childs: WidgetView[] = []) {
    this._id = id;
    this._base_element = base_element;
    this._childs = childs;
  }

  id(): number {
    return this._id;
  }

  baseElement(): string {
    return this._base_element;
  }

  protected addEffect(effect: EffectBase): void {
    for (let i = 0; i < this._effects.length; ++i) {
      if (this._effects[i].id() == effect.id()) {
        return;
      }
    }
    this._effects.push(effect);
  }

  protected addEffectToAllWidgetTree(effect: EffectBase): void {
    this.addEffect(effect);
    for (let i = 0; i < this._childs.length; ++i) {
      this._childs[i].addEffectToAllWidgetTree(effect);
    }
  }

  protected removeEffect(effect: EffectBase): void {
    let new_effects: EffectBase[] = [];
    for (let i = 0; i < this._effects.length; ++i) {
      if (this._effects[i] == effect) {
        continue;
      }
      new_effects.push(this._effects[i]);
    }

    this._effects = new_effects;
  }

  protected removeEffectFromAllWidgetTree(effect: EffectBase): void {
    this.removeEffect(effect);
    for (let i = 0; i < this._childs.length; ++i) {
      this._childs[i].removeEffectFromAllWidgetTree(effect);
    }
  }

  protected addChild(child: WidgetView, after_i: number = -1): void {
    for (let i = 0; i < this._childs.length; ++i) {
      if (this._childs[i].id() == child.id()) {
        return;
      }
    }
    if (after_i < 0) {
      this._childs.push(child);
      return;
    }

    if (after_i >= this._childs.length) {
      alert("Try to add widget after index out of range!");
      return;
    }

    let childs = [];
    for (let i = 0; i <= this._childs.length; ++i) {
      childs.push(this._childs[i]);
      if (i == after_i) {
        childs.push(child);
      }
    }

    this._childs = childs;
  }

  protected removeChild(child: WidgetView): void{
    this._childs = this._childs.filter((child_) => child_.id() != child.id());
  }

  render(): HTMLElement {
    let result = document.createElement(this._base_element);
    if (this._effects.length > 0) {
      let className = this._effects[0].toClassName();
      for (let i = 1; i < this._effects.length; ++i) {
        className += " " + this._effects[i].toClassName();
      }
      result.className = className;
    }

    if (this._childs.length > 0) {
      for (let i = 0; i < this._childs.length; ++i) {
        result.append(this._childs[i].render());
      }
    }

    return result;
  }
}
