let id = 0;

export function GetId(): number {
  id = id + 1;
  return id - 1;
}

export function ResetIdTo(id_: number): void {
  id = id_;
}
