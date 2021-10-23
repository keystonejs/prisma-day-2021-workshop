/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint no-unused-vars: [ "error", { "argsIgnorePattern": "Ignored" } ] */
// eslint-disable-line no-unused-vars
export type Maps<D, R> = (mapsIgnored: D) => R;

// eslint-disable-line no-unused-vars
export const drop =
  <T>(valIgnored: T) =>
  <F>(f: F) =>
    f;

// typescript is better at deducing the types of curried types than uncurried,
// thus this style of definition is necessary to eliminate the need for the dreaded polymorphic types.

export const addPropValue =
  <O>(oldData: O) =>
  <N>(newDataFun: Maps<O, N>): O & N =>
    Object.assign({}, oldData, newDataFun(oldData));
