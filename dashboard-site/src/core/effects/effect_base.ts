export abstract class EffectBase {
  private readonly _id: string;

  id(): string {
    return this._id;
  }

  toClassName(): string {
    return this._id;
  }

  abstract toClassDefinition(): string;
}
