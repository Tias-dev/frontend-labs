export class Effect {
  private readonly _id: string;

  constructor(id: string) {
    this._id = id;
  }

  id(): string {
    return this._id;
  }

  toClassName(): string {
    return this._id;
  }
}
