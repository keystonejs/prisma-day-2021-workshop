import { keystoneNextjsBuildApiKey } from './keystone';

//Useful for monadic typing. WIP
const unit = {};

//Logical combinators
const ftrue = (a: any) => (b: any) => (c: any) => a(c);
const ffalse = (a: any) => (b: any) => b;
const fkeep = (a: any) => a;
const fcompose = (a: any) => (b: any) => (c: any) => a(b(c));

//Abstract away this very useful primitive into functional land
const funIf = (val: any) => (!!val ? ftrue : ffalse);
const keepIf = (val: any) => (!!val ? fkeep : ffalse);

// WIP: monadic functions set a challange for typing in ts. For the moment any will have to do to get things moving
// FIXME: Strongly type me please! Basically its a string or a monad applied to a string, with the terminating string used to terminate props
// and additional input to the render function to abstract away the names.
// FIXME: Parameterise the type so that it becomes a general purpose monadic compiler.
// Note: Applicative anys are typesafe.

const pure_string_monad =
  (termPredicate: any) =>
  (termString: any) =>
  (transferFun: any) =>
  (renderFun: any) =>
  (state: string) =>
  (next_delta: string): any =>
    next_delta === termString
      ? renderFun(termString)(state)
      : pure_string_monad(termPredicate)(termString)(transferFun)(renderFun)(
          transferFun(state)(next_delta)
        );

const cmpString = (termString: string) => (next_delta: string) =>
  next_delta === termString;
const spaceJoinStrings = (a: string) => (b: string) => a + ' ' + b;

const renderTailwind = (cname: string) => (tailwindCompositeStyle: string) =>
  cname + '=' + tailwindCompositeStyle;
const renderState = (cname: string) => (state: string) => state;
const renderLog = (cname: string) => (tailwindCompositeStyle: string) =>
  console.log(tailwindCompositeStyle);

const tailwindMonad =
  pure_string_monad(cmpString)('class')(spaceJoinStrings)(renderTailwind);

//Specialise for each file
const emitLog = 'emitLog';
const logMonadClos = (fileName: string) =>
  pure_string_monad(cmpString)(emitLog)(spaceJoinStrings)(renderLog);

const utilsLog = logMonadClos('utils');

// The above is a fully featured monadic tailwind compiler :)

//Very bad code, has to go soon. Monadic replacement.
const rmap_va =
  (...props: any) =>
  (f: any) => {
    props.forEach((element: any) => {
      f(element);
    });
  };

let colors = require('colors/safe');

// Fix Me: Test code: Needs another home.
//This is one place where any means it! The intent was object dumping code, down to
//every leaf. A testground for DRY logging in ts.
// Closures are good for logging, localising to particular files/functions/lines ... the issues of this short segment quickly shows why.
// I have some multicol markup for logging, it bash though, so replaces console.log.
// A markup standard for shell would be useful.

const log = (s: string) => console.log(s);

export const success = (...obj: any) =>
  rmap_va(obj)((x: any) => log(colors.green(x.toString())));

export const warn = (...obj: any) =>
  rmap_va(obj)((x: any) => log(colors.yellow(x.toString())));

export const report_security_incident = (...obj: any) =>
  rmap_va(obj)((x: any) => log(colors.red(x.toString())));

export const report_error = (...obj: any) =>
  rmap_va(obj)((x: any) => log(colors.red(x.toString())));

export const gql = ([content]: TemplateStringsArray) => content;

//Testing the new logging api.
export const localWarning = (a: string) => utilsLog(colors.yellow(a));
export const localError = (a: string) => utilsLog(colors.red(a));
export const localSuccess = (a: string) => utilsLog(colors.green(a));

export async function fetchGraphQL_inject_api_key(
  query: string,
  variables?: Record<string, any>
) {
  funIf(keystoneNextjsBuildApiKey.includes('keystone'))(
    localWarning('utils: prototype api key: ' + keystoneNextjsBuildApiKey)
  )(localSuccess('Next build triggered: Api key injected.'))(emitLog);

  return fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': keystoneNextjsBuildApiKey,
    },
  })
    .then(x => x.json())
    .then(({ data, errors }) => {
      if (errors) {
        throw new Error(
          `GraphQL errors occurred:\n${errors
            .map((x: any) => x.message)
            .join('\n')}`
        );
      }
      return data;
    });
}
