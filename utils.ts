import { keystoneNextjsBuildApiKey } from './keystone';
import { HardenedAny } from './wrap_any';

import colors from 'colors/safe';

// Fix Me: Test code: Needs another home.
// Logging is one place where HardenedAny is needed! The intent was object dumping code, down to
//every leaf. A testground for DRY logging in ts.
// Closures are good for logging, localising to particular files/functions/lines ... the issues of this short segment quickly shows why.
// I have some multicol markup for logging, it bash though, so replaces console.log.
// A markup standard for shell would be useful.

//const log = (s: string) => console.log(s);
//Reverse mapping for var args, rest parameters ... handy but slightly disfunctional, forEach is not strongly typed.
export const fix = <T>(x: T) => x;

export const successCol = colors.green;
export const warningCol = colors.yellow;
export const errorCol = colors.red;

export type Tunit = void;

export type ThunkProc = () => Tunit;

interface CleanError {
  name: string;
  message: string;
  stack: string;
}

export type LogEventRenderer = (maps: CleanError) => string;

export type ColFun = (maps: string) => string;

export const sep = ': ';

export const baseErrorMsg = 'utils: logContextInfoGen::' + sep;
export const undefinedVariableMsg =
  baseErrorMsg + 'Attempted to log an undefined variable.' + sep;
export const unknownLineAndFileMsg =
  baseErrorMsg + 'Unknown line and file' + sep;
export const cantOpenErrorMsg =
  baseErrorMsg + 'Cant access stack info from Error()' + sep;

export const fileLineRenderer = (e: CleanError) => {
  const regex = /\((.*):(\d+):(\d+)\)$/;
  const match = regex.exec(e.stack);

  return match
    ? match[1] + sep + match[2] + sep + match[3]
    : unknownLineAndFileMsg + sep + e.stack;
};

export const stackRenderer = (e: CleanError) => e.stack;

export const simpleLogger = (msg: string) => console.log(Date() + sep + msg);

export const logContextInfoGen =
  (msgRenderer: LogEventRenderer) =>
  (col: ColFun) =>
  (toBeLogged: HardenedAny): Tunit => {
    if (toBeLogged === undefined)
      return logContextInfoGen(stackRenderer)(warningCol)(undefinedVariableMsg);

    var cleanMessage: string;

    if (typeof toBeLogged === 'string') {
      cleanMessage = col(toBeLogged);
    } else {
      // Strip anything else down to its source code, so we know what is being sent to us.
      // and print it plain, nothing is worse than red source code ...
      cleanMessage = toBeLogged.toString();
    }
    const e = new Error();
    if (!e.stack)
      return simpleLogger(errorCol(cantOpenErrorMsg) + cleanMessage);
    const ce = e as CleanError;

    const info = msgRenderer(ce);

    simpleLogger(info + sep + cleanMessage);
  };

const logContextInfo =
  (col: ColFun) =>
  (a: HardenedAny): void =>
    logContextInfoGen(fileLineRenderer)(col)(a);

export const log = {
  warning: (a: HardenedAny) => logContextInfo(warningCol)(a),
  error: (a: HardenedAny) => logContextInfo(errorCol)(a),
  success: (a: HardenedAny) => logContextInfo(successCol)(a),
  trace: (a: HardenedAny) => logContextInfoGen(stackRenderer)(fix)(a),
  reportSecurityIncident: (a: HardenedAny) => logContextInfo(errorCol)(a),
};

export const gql = ([content]: TemplateStringsArray) => content;

export async function fetchGraphQL_inject_api_key(
  query: string,
  variables?: Record<string, HardenedAny>
) {
  //Intentionally create an undefined to test HardenedAny
  //var x;
  //log.success(x);

  keystoneNextjsBuildApiKey.includes('keystone')
    ? log.warning('Prototype api key: ' + keystoneNextjsBuildApiKey)
    : log.success('Next build: x-api-key: tx');

  return fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': keystoneNextjsBuildApiKey,
    },
  })
    .then(x => x.json())
    .then(({ data }) => {
      log.success('Next build: json: rx');
      return data;
    })
    .catch(msg =>
      log.error('Next build: did not recieve static site data: ' + sep + msg)
    );
}
