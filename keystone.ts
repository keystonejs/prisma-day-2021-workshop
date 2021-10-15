import { HardenedAny, RecursiveTypeAny } from './wrap_any';
import { config } from '@keystone-next/keystone';
import { statelessSessions } from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';

import { lists, extendGraphqlSchema } from './schema';
import { permissions } from './schema/access';

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
  (toBeLogged: HardenedAny): RecursiveTypeAny => {
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
    if (!e.stack) {
      simpleLogger(errorCol(cantOpenErrorMsg) + cleanMessage);
    } else {
      const ce = e as CleanError;
      const info = msgRenderer(ce);
      simpleLogger(info + sep + cleanMessage);
    }
    return logContextInfoGen(stackRenderer)(warningCol);
  };

const logContextInfo = (col: ColFun) => (a: HardenedAny) =>
  logContextInfoGen(fileLineRenderer)(col)(a);

export const log = {
  sep: sep,
  warning: (a: HardenedAny) => logContextInfo(warningCol)(a),
  error: (a: HardenedAny) => logContextInfo(errorCol)(a),
  success: (a: HardenedAny) => logContextInfo(successCol)(a),
  trace: (a: HardenedAny) => logContextInfoGen(stackRenderer)(fix)(a),
  info: (a: HardenedAny) => logContextInfo(fix)(a),
  reportSecurityIncident: (a: HardenedAny) => logContextInfo(errorCol)(a),
};

const dbUrl =
  `${process.env.DATABASE_URL}` ||
  `postgres://${process.env?.POSTGRES_USER}:${process.env?.POSTGRES_PASSWORD}@${process.env?.POSTGRES_HOST}/${process.env?.POSTGRES_DB}`;

export const keyStoneHost = process.env?.KEYSTONE_HOST || 'localhost';

log.info(`Database url: ${dbUrl}`);
log.success(dbUrl);
log.info(`Keystone host`);
log.success(keyStoneHost);

const sessionSecret =
  process.env.SESSION_SECERT ||
  'iLqbHhm7qwiBNc8KgL4NQ8tD8fFVhNhNqZ2nRdprgnKNjgJHgvitWx6DPoZJpYHa';

export const keystoneNextjsBuildApiKey =
  process.env.KEYSTONE_NEXTJS_BUILD_API_KEY ||
  'utils.ts:_keystoneNextjsBuildApiKey_says_change_me_!!!!!!!_im_just_for_testing_purposes';

const auth = createAuth({
  identityField: 'email',
  secretField: 'password',
  listKey: 'User',
  sessionData: `id name role {
    canManageContent
    canManageUsers
  }`,
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    itemData: {
      role: {
        create: {
          name: 'Super User',
          canManageContent: true,
          canManageUsers: true,
        },
      },
    },
  },
});

export default auth.withAuth(
  config({
    db: {
      url: dbUrl,
      provider: 'postgresql',
      useMigrations: true,
    },
    ui: { isAccessAllowed: permissions.canUseAdminUI },
    lists,
    session: statelessSessions({
      secret: sessionSecret,
    }),
    extendGraphqlSchema,
  })
);
