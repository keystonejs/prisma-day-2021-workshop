//Test code to see how easy it is to define recursive constants in the CCC

interface IfooPackage {
  prop1: (bind: IfooPackage) => string;
  prop2: (bind: IfooPackage) => string;
  prop3: (bind: IfooPackage) => undefined;
}
enum FooMethods {
  Up = 'prop1',
  Down = 'prop2',
  Bad = 'prop3',
}
const Prop1 = 'prop1';
const Prop2 = 'prop2';

type FooProps = typeof Prop1 | typeof Prop2;

export const fooPackage = {
  prop1: (self: IfooPackage) => 'hi',
  prop2: (self: IfooPackage) => self.prop1 + ' world',
  prop3: (self: IfooPackage) => undefined,
} as const;

export const bindMod = (pack: IfooPackage) => (attr: FooMethods) => {
  return pack[attr](pack);
};

export const bindMod2 = (pack: IfooPackage) => (attr: FooProps) => {
  return pack[attr](pack);
};

export const bindMod3 = (pack: IfooPackage) => (attr: FooProps) => {
  let fun = pack[attr](pack);
  return fun === undefined ? 'undefined' : fun;
};

console.log(fooPackage.prop2(fooPackage));

console.log(bindMod(fooPackage)(FooMethods.Down));

console.log(bindMod2(fooPackage)(Prop2));

//Not very easy, but probably necessary for parsing js structures, or can we use a neater CMC pattern?

//What needs to be achieved get_attr(obj)(attr).good(...).bad()

export type BadValue = undefined | null;

export type Possibly<T> = T | BadValue;

export class MaybeIOAux<T> {
  val: Possibly<T>;
  constructor(v: Possibly<T>) {
    this.val = v;
  }
  good(f: <R>(maps: T) => void) {
    if (this.val !== undefined && this.val !== null) f(this.val);
    return this;
  }
  bad(f: (maps: BadValue) => void) {
    if (this.val === undefined || this.val === null) f(this.val as BadValue);
  }
}

const sub_flds = {
  page1: 'hi',
  page2: 'hi2',
};

const test_vals = {
  sf: sub_flds,
  nv: null,
  uv: undefined,
};
export const MaybeInput = <T>(vals: Possibly<T>) => new MaybeIOAux(vals);

export const MaybeInputTests = () => {
  MaybeInput(test_vals)
    .good((val: typeof test_vals) => console.log('Good Value: ' + val.sf.page1))
    .bad(<T>(val: T) => console.log('Bad Value'));

  MaybeInput(null)
    .good(<T>(val: T) => console.log('Good Value'))
    .bad(<T>(val: T) => console.log('Bad Value'));
};
