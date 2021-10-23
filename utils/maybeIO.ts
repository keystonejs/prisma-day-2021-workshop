import reader from 'readline-sync';

import { u, U } from './unit';

import { bad, isBad, mapBad, with_default } from './badValues';

export type IOthunk<T> = () => T;

export const makeIO = <T>(f: IOthunk<T>): IO<T> => new IO<T>(f);

export class IO<T> {
  private act: IOthunk<T>;

  constructor(action: IOthunk<T>) {
    this.act = action;
  }

  //Embed values and functions
  static root = <T>(val: T) => makeIO<T>(() => val);
  static rootfun = <T>(thunk: () => T) => makeIO<T>(thunk);

  readonly run = (): T => this.act();

  readonly fbind = <M>(io: (maps: T) => IO<M>) =>
    makeIO(() => io(mapBad(this.act())).run());

  readonly then = <R>(f: (maps: NonNullable<T>) => R) =>
    makeIO(() => {
      const x = this.act();
      return isBad(x) ? bad<R>() : mapBad(f(x as NonNullable<T>));
      //.catch(this.warn("fbind error")(x => bad<R>()));
    });

  readonly fmap = this.then;
  readonly promise = this.then;

  //give a then callback to implement the async api.
  readonly exec = (def: NonNullable<T>) => {
    return {
      then: <R>(f: (maps: NonNullable<T>) => R) =>
        f(with_default(def)(this.run())),
    } as const;
  };
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export const putStr = (s: string) => process.stdout.write(s);

//This is a good model, its a raw socket write,
//So we need to attach a callback to it
export const putStrM = (s: string) =>
  makeIO(() => {
    putStr(s);
    return s;
  });

export const getLine = () => reader.question('');

export const getStrM = (x: U) => IO.rootfun(getLine);

export const pure = <T>(x: T) => IO.root(x);

export const prompt =
  <V>(str: string) =>
  (x: V) =>
    putStrM(str);

export const ioRoot = pure(u);
