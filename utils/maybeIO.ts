import reader from 'readline-sync';

import { u, U, cr, sideEffect } from './unit';

import { log, xlog, fix } from './logging';

import { isBad, mapBad, with_default } from './badValues';

export type IOthunk<T> = () => T;

// A combination of IO/Maybe, all linked together in a way that largely works as expected.
// If used non-recursively, it forces the CCC, quite rigorously. Trying to run the code unbound
// to the other scripts is an amusingly visual lesson in async code.
// String IO needs additonal forwarding parms to allow persistance of environment.
//https://www.youtube.com/watch?v=vkcxgagQ4bM 21:15 ... you might be asking, what is this U?

// The next line is a problem, because it uses the heap. The compiler needs to do a lot more work
// to build monadic code efficiently, largely eliminating this new, according to the context.
// Since we are explicitly calling new, this will be tricky.
// The compiler will take this new instruction literally. This is the main point of Bartosz's
// lecture, its a howto and a warning: take this code seriously, it presents problems for compilers.
// C++ has big issues with it, and typescript suffers too.
// There are workarounds, based on coroutines, which can allocate memory more efficiently.
// It's not clear these will code that cleanly in typescipt, but the basic monadic code is simpler
// in typescript, bar it requires async handling.

export const makeIO = <T>(f: IOthunk<T>): IO<T> => new IO<T>(f);

export class IO<T> {
  private act: IOthunk<T>;

  constructor(action: IOthunk<T>) {
    this.act = action;
  }

  //Embed values and functions
  static root = <T>(val: T) => makeIO<T>(() => val);
  static rootfun = <T>(thunk: () => T) => makeIO<T>(thunk);

  private readonly run = () => this.act();

  readonly warn =
    <R>(msg: string) =>
    (f: (maps: T) => R) =>
      sideEffect<T, void, R>(x => log().warning(msg))(f);

  readonly fbind = <M>(io: (maps: T) => IO<M>) =>
    makeIO(() => io(mapBad(this.act())).run());

  readonly then = <R>(f: (maps: T) => R) =>
    makeIO(() => {
      const x = this.act();
      return isBad(x) ? mapBad(x) : mapBad(f(x));
      //.catch(this.warn("fbind error")(x => bad<R>()));
    });

  readonly fmap = this.then;

  //give a then callback to implement the async api.
  readonly exec = (def: T) => {
    return { then: <R>(f: (maps: T) => R) => f(with_default(def)(this.run())) };
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
