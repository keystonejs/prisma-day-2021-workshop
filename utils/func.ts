/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
export type Maps<D, R> = (mapsIgnored: D) => R;

export const drop =
  <T>(valIgnored: T) =>
  <F>(f: F) =>
    f;

export const fFalse = drop;

export const fTrue =
  <F>(f: F) =>
  <T>(valIgnored: T) =>
    f;

export const fBool = (x: boolean) => (x ? fTrue : fFalse);

export type Tfbool = typeof fTrue | typeof fFalse;

export const fNot = (g: Tfbool) => g(fFalse)(fTrue);
export const fOr = (g: Tfbool) => (f: Tfbool) => g(g)(f(f)(fFalse));
export const fAnd = (g: Tfbool) => (f: Tfbool) => g(f(f)(fFalse))(fFalse);

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
