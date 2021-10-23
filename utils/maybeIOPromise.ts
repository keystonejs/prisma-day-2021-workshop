import reader from 'readline-sync';
import { u, U } from './unit';

import { log } from './logging';

import { bad, isBad, mapBad, with_default } from './badValues';

export type IOthunk<T> = () => Promise<T>;

// A combination of IO/Maybe/Promises, all linked together in a way that largely works as expected.
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

export const embed = <T>(val: T) => Promise.resolve(val);

export class IO<T> {
  private act: IOthunk<T>;

  constructor(action: IOthunk<T>) {
    this.act = action;
  }

  //Embed values and functions
  static root = <T>(val: T) => makeIO<T>(() => embed(val));
  static rootfun = <T>(thunk: () => T) => makeIO<T>(() => embed(thunk()));

  readonly run = () => this.act();

  readonly fbind = <M>(io: (maps: T) => IO<M>) =>
    makeIO(
      () => this.act().then(x => io(mapBad(x)).run())
      //.catch(x => this.warn("fbind error")(err => io(bad<T>()).run()))
    );

  readonly then = <R>(f: (maps: NonNullable<T>) => R) =>
    makeIO(() =>
      this.act().then(x =>
        isBad(x) ? embed(bad<R>()) : embed(mapBad(f(x as NonNullable<T>)))
      )
    );
  //.catch(this.warn("fbind error")(x => bad<R>()));

  //.then for promise returning functions.
  readonly promise = <R>(f: (maps: NonNullable<T>) => Promise<R>) =>
    makeIO(() =>
      this.run().then(x =>
        isBad(x) ? bad<Promise<R>>() : mapBad(f(x as NonNullable<T>))
      )
    );

  //Monitor the current state of the environment
  readonly env = () =>
    this.then(x => {
      log().info(x);
      return x;
    });

  readonly fmap = this.then;

  readonly exec = (def: NonNullable<T>) => {
    const prom = embed(def);
    return this.run()
      .then(x => embed(with_default(def)(x)))
      .catch(x => {
        log().warning(x);
        return prom;
      })
      .finally();
  };
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export const putStr =
  <T>(env: T) =>
  (s: string) =>
    new Promise<T>(resolved => {
      // eslint-disable-line no-unused-vars
      process.stdout.write(s, z => resolved(env));
      return env;
    });

//This is a good model, its a raw socket write,
//So we need to attach a callback to it
export const putStrM = (s: string) => makeIO(() => putStr(s)(s));

export const getLine = () => reader.question('');
export const pure = <T>(x: T) => IO.root(x);
// disable the error, but lint has a point, the environment is lost
// synchronous, because async keyboard IO is a pain.

// eslint-disable-line no-unused-vars
export const getStrM = (x: U) => pure(x).then(z => getLine());

export const prompt =
  <V>(str: string) =>
  (x: V) => {
    putStrM(str);
    return x;
  };

export const ioRoot = pure(u);
