import { Effect } from "../effect";
import { GetId } from "../id";
import { Button } from "../views/button";
import { Label } from "../views/label";
import { ViewBase } from "../views/view_base";
import { Widget } from "./widget";

class CounterValue extends ViewBase {
  private _value: number = 0;
  private _step: number = 1;

  constructor(id: number, value: number = 0, step: number = 1) {
    super(id, "div");

    this.addEffect(new Effect("counter-value"));
    this._value = value;
    this._step = step;
  }

  increment() {
    this._value += this._step;
    this.htmlElement().innerHTML = `${this._value}`;
  }

  decrement() {
    this._value -= this._step;
    this.htmlElement().innerHTML = `${this._value}`;
  }

  setStep(new_step: number) {
    this._step = new_step;
  }

  render(): HTMLElement {
    const result = super.render();
    result.innerHTML = `${this._value}`;
    return result;
  }
}

export class Counter extends Widget {
  constructor(id: number) {
    const counter = new CounterValue(GetId());
    const increment_button = new Button(GetId(), "increment", "+");
    const decrement_button = new Button(GetId(), "decrement", "-");
    const step_field = new Label(GetId(), "number");
    step_field.setText("1");
    const step_label = new ViewBase(GetId(), "span");
    (step_label.htmlElement() as HTMLSpanElement).textContent = "Step: ";

    const buttons_view = new ViewBase(GetId(), "div");
    const counter_view = new ViewBase(GetId(), "div");
    const step_wrapper = new ViewBase(GetId(), "div");
    const composed_view = new ViewBase(GetId(), "div");

    buttons_view.addChild(increment_button);
    buttons_view.addChild(decrement_button);
    buttons_view.addEffect(new Effect("counter-buttons"));

    counter_view.addChild(counter);
    counter_view.addChild(buttons_view);
    counter_view.addEffect(new Effect("counter-counter"));

    step_wrapper.addChild(step_label);
    step_wrapper.addChild(step_field);
    step_wrapper.addEffect(new Effect("counter-step-wrapper"));

    composed_view.addChild(counter_view);
    composed_view.addChild(step_wrapper);
    composed_view.addEffect(new Effect("counter-content"));

    increment_button.addOnClickHandler(() => {
      counter.increment();
    });
    decrement_button.addOnClickHandler(() => {
      counter.decrement();
    });

    step_field.addInputChangeHandler((new_text: string) => {
      counter.setStep(Number(new_text));
    });

    super(id, composed_view);
  }
}
