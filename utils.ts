import { keystoneNextjsBuildApiKey } from './keystone';
let colors = require('colors/safe');

// Fix Me: Test code: Needs another home.
//This is one place where any means it! The intent was object dumping code, down to
//every leaf. A testground for DRY logging in ts.
// Closures are good for logging, localising to particular files/functions/lines ... the issues of this short segment quickly shows why.
// I have some multicol markup for logging, it bash though, so replaces console.log.
// A markup standard for shell would be useful.

//const log = (s: string) => console.log(s);
//Reverse mapping for var args, rest parameters ... handy but slightly disfunctional, forEach is not strongly typed.

export const successCol = colors.green;
export const warningCol = colors.yellow;
export const errorCol = colors.red;

const logContextInfo = (msg: string) => {
  const e = new Error();
  const errmsg = 'Unknown line and file!!';
  const sep = ': ';
  if (!e.stack) return errmsg;

  const regex = /\((.*):(\d+):(\d+)\)$/;
  const match = regex.exec(e?.stack?.split('\n')[2]);
  const info = match
    ? Date() + sep + match[1] + sep + match[2] + sep + match[3]
    : errmsg;

  console.log(info + sep + msg);
};

export const log = {
  warning: (a: any) => logContextInfo(warningCol(a.toString())),
  error: (a: any) => logContextInfo(errorCol(a.toString())),
  success: (a: any) => logContextInfo(successCol(a.toString())),
};

//Right monadic action on vargs.
const ract_va =
  <Tprops>(...props: Tprops[]) =>
  (f: (maps: Tprops) => void) =>
    props.forEach((x: Tprops) => f(x));

export const success = (...obj: any) =>
  ract_va(obj)((x: any) => log.success(x));

export const warn = (...obj: any) => ract_va(obj)((x: any) => log.warning(x));

export const report_security_incident = (...obj: any) =>
  ract_va(obj)((x: any) => log.warning(x));

export const report_error = (...obj: any) =>
  ract_va(obj)((x: any) => log.error(x));

//Testing the new logging api.
export const endLog = 'endLog';

const utilsWarning = (a: string) => logContextInfo(warningCol(a));
const utilsError = (a: string) => logContextInfo(errorCol(a));
const utilsSuccess = (a: string) => logContextInfo(successCol(a));

export const gql = ([content]: TemplateStringsArray) => content;

export async function fetchGraphQL_inject_api_key(
  query: string,
  variables?: Record<string, any>
) {
  keystoneNextjsBuildApiKey.includes('keystone')
    ? utilsWarning('Prototype api key: ' + keystoneNextjsBuildApiKey)
    : utilsSuccess(
        'Next build triggered: Api key injected into x-api-key headers.'
      );

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
