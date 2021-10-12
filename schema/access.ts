import { KeystoneContext } from '.keystone/types';

declare type MaybePromise<T> = Promise<T> | T;

export type SessionContext = {
  session?: {
    data: {
      name: string;
      role: {
        canManageContent: boolean;
        canManageUsers: boolean;
      };
    };
    itemId: string;
    listKey: string;
  };
};

export type SessionFrame = {
  session: ItemContext;
  context: SessionContext;
  listKey: string;
  operation: string;
};

export type ItemContext = { item: any } & SessionContext;

const unit = {};
const rmap_va =
  (...props: any) =>
  (f: any) => {
    props.forEach((element: any) => {
      f(element);
    });
  };

let colors = require('colors/safe');

const success = (...obj: any) =>
  rmap_va(obj)((x: any) => console.log(colors.green(x.toString())));

const warn = (...obj: any) =>
  rmap_va(obj)((x: any) => console.log(colors.yellow(x.toString())));

const report_security_incident = (...obj: any) =>
  rmap_va(obj)((x: any) => console.log(colors.red(x.toString())));

const xwarn = (...obj: any) => unit;

export const isBuildEnvir = (frame: SessionFrame): boolean => {
  if (frame.session === undefined) {
    //const headers = frame.context.req?.headers;
    //const host = headers ? headers['x-forwarded-host'] || headers['host'] : null;
    //const url = headers?.referer ? new URL(headers.referer) : undefined;

    warn('access::isBuildEnvir: authentication breach:');
    //warn( headers)
    //warn(host)
    //warn(url)

    warn('undefined frame.session:');
    warn('Assuming a next build event:');
    warn(
      'Assumed next build authentication breach: Will bless next build with super user queries:'
    );
    //Massive security hole to be fixed with a shared secret.

    warn(
      'Blessed super user access to next build: (without API token: Do not deploy yet.)'
    );
    //localWarn("withKeysone code", withKeystone)
    return true;
  }
  return false;
};

export const isSignedIn = ({ session }: SessionContext) => {
  return !!session;
};

export const permissions = {
  canManageContent: ({ session }: SessionContext) => {
    return !!session?.data?.role?.canManageContent;
  },
  canManageUsers: ({ session }: SessionContext) => {
    return !!session?.data?.role?.canManageUsers;
  },
};

export const rules = {
  canUseAdminUI: ({ session }: SessionContext) => {
    //console.log('Typeof session: ' + typeof session);
    return !!session?.data.role as MaybePromise<boolean>;
  },
  operationCanManageContentList: ({ item }: ItemContext) => {
    warn('rules.operationCanReadContentList:');
    warn(item);
    if (!permissions.canManageContent(item)) return false;

    return true;
  },
  filterCanReadContent: () => {
    console.log('rules.filterCanReadContent');
    return { status: { equals: 'published' } };
  },
  canReadContentList: ({ item }: ItemContext) => {
    console.log('rules.canReadContentList');
    if (!permissions.canManageContent(item)) return false;

    return true;
  },

  canManageUser: ({ item, session }: ItemContext) => {
    if (!permissions.canManageUsers({ session })) return false;
    if (session?.itemId !== item?.id) return false;
    return true;
  },
  operationCanManageUserList: ({ session }: SessionContext) => {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageUsers({ session })) return true;

    return false;
  },
  filterCanManageUserList: ({ item, session }: ItemContext) => {
    return { canManageUsers: { equals: true } };
  },
};

export const OperationCanManageContentList = ({ session }: SessionFrame) =>
  rules.operationCanManageContentList(session);

export const EVERY_POST_STATUS = {
  status: { in: ['published', 'draft', 'archive'] },
};
export const UNIT_POST_STATUS = { status: { in: [] } };
export const PUBLISHED_POST_STATUS = { status: { in: ['published'] } };

export const FilterCanManageContentList = (frame: SessionFrame) => {
  if (frame === undefined) {
    report_security_incident(
      'Minor security breach: potential auth bug. undefined frame: query downgraded to public.'
    );
    return PUBLISHED_POST_STATUS;
    //Give no information away that they have been noticed, but if there's no frame
    //it's hard to imagine where the reply is going to go ... if exec ever gets here, it's close
    //to a fatal error. What is the best thing to do here? Nothing? throw?

    //The front line security audit: Initial musings:

    //SSG has the best security profile, and appears completely safe to use SSG for a cdn deployed site without auth.

    //However well local code is audited for security, there is a known can of worms in apollo. It will exit(1)
    //at a moments notice, taking ks down with it. The upshot is gql must be considered a soft target,
    //and this single, vulnerable endpoint is suitably firewalled, potentially using REST, which
    //has a far improved security model.

    // So: safest is when gql is restriced to being a tool for the offline
    // build process only, and a convenient one at that. If it is deployed online, great care has to be taken
    // to protect it from badly formed queries, and restrict it's input grammar. It's not clear this is any easier to write than
    // a well defined REST api.

    // A mitigating factor here is the use of isFilterable on individual fields. When first porting Jeds app, it seemed like an inconvenience,
    // but now, it is seen as providing critical security, restricting queries to a vulnerable apollo.

    // !!! This is so important for a production server than does use gql only, that it might be worth
    // issuing a warning when a list is defaulted to isFilterable on all fields. Warnings like this can
    // be so useful to the correct setup of a dev kit. Also a warning if a field is in a where clause, but not filterable ... can same poor front end developers hours.
    // The more info an error can do to help a dev chase its location, the better. When logs get multiplexed by multiple threads, knowing what corresponds to what can waste time.
    // Keystone is such a happy app that a warning really gets noticed ;)

    // There are alternatives:
    // jQuery to avoid layers of gql inefficiences, and workers.
    // Also, REST can start hard, C++ calling core pgsql. From the keystone perspective, it's just another target language for an ast,
    // derived from the same schema, but in pgsql C++ (hardest, in every way),
    // my own fav for prototyping, bash pg cli  (v easy: a surprisingly few lines of code, and handy for CI. Also extraordinarily versatile. Can handof via socat, epoll, anything).
    // The ts schema is still the sole source of truth in this model. Nothing much changes in ks, because it is suitably agnostic.

    // Furthermore, gql is not ideally suited to live usage, due to the n+1 problem, and difficuly cacheing a single endpoint.
    // Gql doesn't play nicely with reverse proxies, but REST does. Fashion is cyclical!
    // But for prototyping apis, the playground auto documentation, and SSG/ISR ... it's a massive time saver.

    // There is some convergence in langauge:
    // ts and C++ read very similarly nowadays. As long as everything is done in term of the lambda calculus, it all works out.

    // Unfortunately C++ coroutines are dreadfully thought out. My guess is the committe did not understand the issues https://bartoszmilewski.com/2011/07/11/monads-in-c/
    // raised. Fortunately, I have successfully developed some workarounds for these issue. ;)

    //The AdminUI is considered a fairly soft target, mainly from DoS. But it's easy to harden to the public, using an ssh pki tunnel for access, bringing the auth
    //to industry best practise, but remaining vulnerable to authorized bad actors, who we have to keep as far away from the gql endpoint as possible.

    //All this is of relevant here, because this is the last line of defense!

    //In testing, bad username password combinations were reporting auth failure
    //immediately. A delay of a few seconds has an improved security model.
  }
  //Needs shared secret, set in bash, imported via process.env, usage tested in the CI workflow, which act as the base spec for a container to run keystone/next in.
  if (isBuildEnvir(frame)) {
    success('');
    return EVERY_POST_STATUS;
  }
  //The perms check is only running client side. Review: check the authorization props are checked
  //server side to.
  if (!!permissions?.canManageContent(frame.session)) {
    success('Blessed super user access to the known content manager:');
    success(frame?.context?.session?.data?.name);
    success('');
    return EVERY_POST_STATUS;
  }
  success('Client receives only published posts');
  return PUBLISHED_POST_STATUS;
};
