export type BadData = undefined | null;

export type Possibly<T> = T | BadData;

export const isBad = <T>(value: Possibly<T>) =>
  value === null || value === undefined;

export const bad = <T>() => null as unknown as T;

export const mapBad = <T>(val: T) => (isBad(val) ? bad<T>() : val);

export const with_default =
  <T>(def: NonNullable<T>) =>
  (val: T): NonNullable<T> =>
    isBad(val) ? def : (val as NonNullable<T>);
