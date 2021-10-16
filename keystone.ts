import { HardenedAny } from './wrap_any';
import { config } from '@keystone-next/keystone';
import { statelessSessions } from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';

import { lists, extendGraphqlSchema } from './schema';
import { permissions } from './schema/access';

import colors from 'colors/safe';

// Fix Me: Logging needs another home again. It also needs to be right near the top of the dependencies, or linkage issues occur.
// Schema might be a good place?
// Logging is one place where HardenedAny is needed! The intent was object dumping code, down to
// every leaf, in a hardened way. A testground for DRY logging in ts.
// Closures are good for logging, localising to particular files/functions/lines, and returning a continuation.

export const fix = <T>(x: T) => x;

//These are functions string => string
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

//export type MonadicType<T> = (maps: T) => MonadicType<T>
// This apparently simple operation, logging, has a fairly rich monadic structure.
// FIXME: TYPEME: return type. It seems to be a recursive union.
export const logContextInfoGen =
  <RetType>(retObj: RetType) =>
  (msgRenderer: LogEventRenderer) =>
  (col: ColFun) =>
  (toBeLogged: HardenedAny): RetType => {
    if (toBeLogged === undefined)
      return logContextInfoGen(retObj)(stackRenderer)(warningCol)(
        undefinedVariableMsg
      );

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
    return retObj;
  };

const logContextInfo =
  <RetType>(retObj: RetType) =>
  (col: ColFun) =>
  (a: HardenedAny): RetType =>
    logContextInfoGen(retObj)(fileLineRenderer)(col)(a);

export class logclos {
  sep: string = sep;
  warning(a: HardenedAny): this {
    return logContextInfo(this)(warningCol)(a);
  }
  error(a: HardenedAny): this {
    return logContextInfo(this)(errorCol)(a);
  }
  success(a: HardenedAny): this {
    return logContextInfo(this)(successCol)(a);
  }
  trace(a: HardenedAny): this {
    return logContextInfoGen(this)(stackRenderer)(fix)(a);
  }
  info(a: HardenedAny): this {
    return logContextInfoGen(this)(fileLineRenderer)(fix)(a);
  }
  reportSecurityIncident(a: HardenedAny): this {
    return logContextInfo(this)(errorCol)(a);
  }
}

const dbUrl =
  `${process.env.DATABASE_URL}` ||
  `postgres://${process.env?.POSTGRES_USER}:${process.env?.POSTGRES_PASSWORD}@${process.env?.POSTGRES_HOST}/${process.env?.POSTGRES_DB}`;

export const keyStoneHost = process.env?.KEYSTONE_HOST || 'localhost';

export const log = new logclos();

log
  .info(`Database url: ${dbUrl}`)

  .success(dbUrl)
  .info(`Keystone host`)
  .success(keyStoneHost);

const sessionSecret =
  process.env.SESSION_SECERT ||
  'iLqbHhm7qwiBNc8KgL4NQ8tD8fFVhNhNqZ2nRdprgnKNjgJHgvitWx6DPoZJpYHa';

export const keystoneNextjsBuildApiKey =
  process.env.KEYSTONE_NEXTJS_BUILD_API_KEY ||
  'keystone.ts:_NextjsBuildApiKey_says_change_me_!!!!!!!_im_just_for_testing_purposes';

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
