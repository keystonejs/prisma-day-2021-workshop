import { u } from './unit';

/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { TypeInferrenceAny } from '../wrap_any';

export type Maps<D, R> = (mapsIgnored: D) => R;
export type Maps2<D1, D2, R> = (maps1Ignored: D1, maps2Ignored: D2) => R;
export type Clos2<D1, D2, R> = (maps1Ignored: D1) => (maps2Ignored: D2) => R;

export type InferArg1<T extends null> = T extends (
  ...args: TypeInferrenceAny[]
) => TypeInferrenceAny
  ? T
  : T extends (a: infer A, b: infer B) => infer R
  ? B extends true
    ? (a: A, b: B) => A
    : A extends true
    ? (a: A) => A
    : () => R
  : never;

export type InferArg2<T extends null> = T extends (
  ...args: TypeInferrenceAny[]
) => TypeInferrenceAny
  ? T
  : T extends (a: infer AIgnored, b: infer B) => infer Rignored
  ? B
  : never;

export const k0 = <T>(fIgnored: T) => u;
export const k1 = <T>(f: T) => f;

export const drop =
  <T>(valIgnored: T) =>
  <F>(f: F) =>
    f;

export const ffalse = drop;

export const ffrue =
  <F>(f: F) =>
  <T>(valIgnored: T) =>
    f;

export const nop = () => {
  return;
};
export const hardCast =
  <A>(f: A) =>
  <T>() =>
    f as unknown as T;

export const boolf = <T>(x: T) => (hardCast(x)<boolean>() ? ffrue : ffalse);
export const boolk = <T>(x: T) => (hardCast(x)<boolean>() ? k1 : k0);

export type Tfbool = typeof ffrue | typeof ffalse;

export const not = (g: Tfbool) => g(ffalse)(ffrue);
export const or = (g: Tfbool) => (f: Tfbool) => g(g)(f(f)(ffalse));
export const and = (g: Tfbool) => (f: Tfbool) => g(f(f)(ffalse))(ffalse);

/* eslint-enable  @typescript-eslint/no-unused-vars */
/* eslint-enable no-unused-vars */

// typescript is better at deducing the types of curried types than uncurried,
// thus this style of definition is necessary to eliminate the need for the dreaded polymorphic types.

export const addPropValue =
  <O>(oldData: O) =>
  <N>(newDataFun: Maps<O, N>): O & N =>
    Object.assign({}, oldData, newDataFun(oldData));

export const fcompose =
  <B, C>(f: Maps<B, C>) =>
  <A>(g: Maps<A, B>) =>
  (val: A) =>
    f(g(val));

export const fpipe =
  <D>(env: D) =>
  <Rf>(f: Maps<D, Rf>) =>
  <Rg>(g: Maps<Rf, Rg>) =>
    fcompose(g)(f)(env);
