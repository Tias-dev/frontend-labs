import { Effect } from "../effect";
import { GetId } from "../id";
import { Button } from "../views/button";
import { ViewBase } from "../views/view_base";
import { Widget } from "./widget";

class HistogramCanvas extends ViewBase {
  private _data: number[] = [];
  private _n_bins: number;
  private _bar_color: string = "#0000ff";
  private _graphic_padding: number = 10;

  constructor(id: number, n_bins: number = 10) {
    super(id, "canvas");
    this._n_bins = n_bins;
  }

  setData(data: number[]): void {
    this._data = data;
  }
  setNBins(n_bins: number): void {
    this._n_bins = n_bins;
  }

  refreshHistogram(): void {
    if (this._data.length == 0) {
      return;
    }

    const min_val = Math.min(...this._data);
    const max_val = Math.max(...this._data);
    const range_vals = max_val - min_val;
    const bin_width = range_vals / this._n_bins;

    const bins = new Array<number>(this._n_bins).fill(0);
    this._data.forEach((n: number) => {
      let bin_index = Math.floor((n - min_val) / bin_width);
      bin_index = Math.min(bin_index, this._n_bins - 1);
      bin_index = Math.max(bin_index, 0);

      ++bins[bin_index];
    });

    const canvas = this.htmlElement() as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const graphWidth = canvas.width - this._graphic_padding * 2;
    const graph_height = canvas.height - this._graphic_padding * 2;
    const max_frequency = Math.max(...bins, 1);
    const bar_width = graphWidth / this._graphic_padding;

    bins.forEach((frequency, index) => {
      // Calculate normalized height percentage based on highest bin
      const normalized_height = frequency / max_frequency;
      const bar_height = normalized_height * graph_height;

      // Canvas coordinates start at top-left (0,0)
      const x = this._graphic_padding + index * bar_width;
      const y = canvas.height - this._graphic_padding - bar_height;

      // Draw the main bar rectangle
      ctx.fillStyle = this._bar_color;
      // Leave a 1px gap between bars for crisp visual boundaries
      ctx.fillRect(x, y, bar_width - 1, bar_height);

      // Optional: Draw text values above bars containing data
      if (frequency > 0) {
        ctx.fillStyle = "#1e293b";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(frequency.toString(), x + bar_width / 2, y - 5);
      }
    });

    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Y Axis Line
    ctx.moveTo(this._graphic_padding, this._graphic_padding);
    ctx.lineTo(this._graphic_padding, canvas.height - this._graphic_padding);
    // X Axis Line
    ctx.lineTo(
      canvas.width - this._graphic_padding,
      canvas.height - this._graphic_padding,
    );
    ctx.stroke();
  }
}

export class Histogram extends Widget {
  private _canvas: HistogramCanvas;
  constructor(id: number) {
    const histogram_composed = new ViewBase(GetId(), "div");
    histogram_composed.addEffect(new Effect("widget-histogram"));

    const set_data_button = new Button(
      GetId(),
      "set-histogram-data-button",
      "Set data",
    );

    set_data_button.addOnClickHandler(() => {
      this.setHistogramData();
    });

    const canvas = new HistogramCanvas(GetId());

    histogram_composed.addChild(set_data_button);
    histogram_composed.addChild(canvas);
    super(id, histogram_composed);
    this._canvas = canvas;
  }

  setHistogramData(): void {
    const numbers_string = prompt("Input numbers(comma separated): ");
    if (!numbers_string) {
      alert("Nothing inputted, do nothing");
      return;
    }

    const numbers = numbers_string
      .split(",")
      .map((n_str: string) => Number(n_str));
    this._canvas.setData(numbers);
    this._canvas.refreshHistogram();
  }
}
