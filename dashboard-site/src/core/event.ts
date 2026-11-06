export class Event<T> {
  private _handlers: ((data: T) => void)[] = [];

  addHandler(handler: (data: T) => void) {
    this._handlers.push(handler);
  }

  invoke(data: T): void {
    for (let i = 0; i < this._handlers.length; ++i) {
      this._handlers[i](data);
    }
  }
}
