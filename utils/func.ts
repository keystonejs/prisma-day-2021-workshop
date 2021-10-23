// eslint-disable-line no-unused-vars
export type Maps<D, R> = (mapsIgnored: D) => R;

// typescript is better at deducing the types of curried types than uncurried,
// thus this style of definition is necessary to eliminate the need for the dreaded polymorphic types.

export const addPropValue =
  <O>(oldData: O) =>
  <N>(newDataFun: Maps<O, N>): O & N =>
    Object.assign({}, oldData, newDataFun(oldData));
