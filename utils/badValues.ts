import { U } from './unit';

export type BadData = undefined | null;

export type RemoveType<Dest, Base, ToGo> = Dest extends Base ? never : ToGo;

export type WellTyped<T> = RemoveType<NonNullable<T>, null, any>;

export const isBad = <T>(value: T) => value === null || value === undefined;

export const bad = <T>() => null as unknown as T;

export const mapBad = <T>(val: T) => (isBad(val) ? bad<T>() : val);

export const with_default =
  <T>(def: NonNullable<T>) =>
  (val: T): NonNullable<T> =>
    isBad(val) ? def : (val as NonNullable<T>);
