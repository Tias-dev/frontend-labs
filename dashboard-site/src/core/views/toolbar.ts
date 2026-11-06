import { Effect } from "../effect";
import type { ToolView } from "./tool";
import { ViewBase } from "./view_base";

export class ToolBarView extends ViewBase {
  constructor(id: number, tools: ToolView[]) {
    super(id, "div");
    this.addEffect(new Effect("toolbar"));
    for (let i = 0; i < tools.length; ++i) {
      this.addChild(tools[i]);
    }
  }
}
