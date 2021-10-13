import { keystoneNextjsBuildApiKey } from './keystone';

// Fix Me: Test code: Needs another home.
//This is one place where any means it! The intent was object dumping code, down to
//every leaf. A testground for DRY logging in ts.
// Closures are good for logging, localising to particular files/functions/lines ... the issues of this short segment quickly shows why.
// I have some multicol markup for logging, it bash though, so replaces console.log.
// A markup standard for shell would be useful.

const log = (s: string) => console.log(s);
//Very bad code, has to go soon. Monadic replacement.
const rmap_va =
  (...props: any) =>
  (f: any) => {
    props.forEach((element: any) => {
      f(element);
    });
  };

let colors = require('colors/safe');
export const success = (...obj: any) =>
  rmap_va(obj)((x: any) => log(colors.green(x.toString())));

export const warn = (...obj: any) =>
  rmap_va(obj)((x: any) => log(colors.yellow(x.toString())));

export const report_security_incident = (...obj: any) =>
  rmap_va(obj)((x: any) => log(colors.red(x.toString())));

export const report_error = (...obj: any) =>
  rmap_va(obj)((x: any) => log(colors.red(x.toString())));

//Useful for monadic typing. WIP
export const unit = {};

//Logical combinators: applicative, so type save.
export const ftrue = (a: any) => (b: any) => (c: any) => a(c);
export const ffalse = (a: any) => (b: any) => b;
export const fkeep = (a: any) => a;
export const fcompose = (a: any) => (b: any) => (c: any) => a(b(c));

//Abstract away this very useful primitive into functional land
export const funIf = (val: any) => (!!val ? ftrue : ffalse);
export const keepIf = (val: any) => (!!val ? fkeep : ffalse);

// WIP: monadic functions set a challange for typing in ts. For the moment any will have to do to get things moving
// FIXME: Strongly type me please! Basically its a string or a monad applied to a string, with the terminating string used to terminate props
// and additional input to the render function to abstract away the names.
// FIXME: Parameterise the type so that it becomes a general purpose monadic compiler.
// Note: Applicative anys are typesafe
// Very quickly, thanks to Church et al, all core ts operators have been abstracted into a functional algebra, forcing the use of primitives that are known to work in adverse situations.
// This lower the burnen of proof on security audits, since the code now has monadic/monoid structure, which is uniform to code in.
export const pure_string_monad =
  (termPredicate: any) =>
  (termString: any) =>
  (transferFun: any) =>
  (renderFun: any) =>
  (state: string) =>
  (next_delta: string) =>
    termPredicate(next_delta)(termString)(renderFun(termString)(state))(
      pure_string_monad(termPredicate)(termString)(transferFun)(renderFun)(
        transferFun(state)(next_delta)
      )
    );

export const fcmpString = (termString: string) => (next_delta: string) =>
  funIf(next_delta === termString);

export const spaceJoinStrings = (a: string) => (b: string) => a + ' ' + b;

export const renderTailwind =
  (cname: string) => (tailwindCompositeStyle: string) =>
    cname + '=' + tailwindCompositeStyle;

export const renderState = (cname: string) => (state: string) => state;

export const renderLog = (cname: string) => (logLine: string) =>
  console.log(logLine);

export const tailwindMonad =
  pure_string_monad(fcmpString)('class')(spaceJoinStrings)(renderTailwind);

//Specialise for a file
export const logMonadClos = (fileName: string) =>
  pure_string_monad(fcmpString)(emitLog)(spaceJoinStrings)(renderLog);

export const successCol = colors.green;
export const warningCol = colors.yellow;
export const errorCol = colors.red;

//Testing the new logging api.
export const emitLog = 'emitLog';

const utilsLog = logMonadClos('utils');
const utilsWarning = (a: string) => utilsLog(warningCol(a));
const utilsError = (a: string) => utilsLog(errorCol(a));
const utilsSuccess = (a: string) => utilsLog(successCol(a));
// The above is a fully featured monadic tailwind compiler :)

const accessLog = logMonadClos('access');
const accessWarning = (a: string) => accessLog(warningCol(a));
const accessError = (a: string) => accessLog(errorCol(a));
const accessSuccess = (a: string) => accessLog(successCol(a));

export const gql = ([content]: TemplateStringsArray) => content;

export async function fetchGraphQL_inject_api_key(
  query: string,
  variables?: Record<string, any>
) {
  funIf(keystoneNextjsBuildApiKey.includes('keystone'))(
    utilsWarning('utils: prototype api key: ' + keystoneNextjsBuildApiKey)
  )(utilsSuccess('Next build triggered: Api key injected.'))(emitLog);

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
