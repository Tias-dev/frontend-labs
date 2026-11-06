import { Effect } from "../effect";
import type { Tool } from "./tool";
import { ViewBase } from "./view_base";

export class ToolBar extends ViewBase {
  constructor(id: number, tools: Tool[]) {
    super(id, "div");
    this.addEffect(new Effect("toolbar"));
    for (let i = 0; i < tools.length; ++i) {
      this.addChild(tools[i]);
    }
  }
}
