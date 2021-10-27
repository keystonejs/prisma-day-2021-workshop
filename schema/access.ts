import { KeystoneContext } from '.keystone/types';
import { keystoneNextjsBuildApiKey } from '../keystone';
import { log } from '../utils/logging';
import { drop } from '../utils/func';
import { ItemType } from '../wrap_any';

export const PUBLISHED = 'published';
export const DRAFT = 'draft';
export const ARCHIVED = 'archive';

export const EDIT = 'edit';
export const READ = 'read';
export const HIDDEN = 'hidden';

export const PUBLISHED_POST_STATUS = { status: { eq: PUBLISHED } };

export type SessionContext = {
  session?: {
    data: {
      id: string;
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

export type FilterFrame = SessionFrame & {
  session: SessionContext;
  context: KeystoneContext;
  listKey: string;
  operation: string;
};

export type ItemContext = { item: ItemType } & SessionContext;
//import { useAuth } from '../components/auth';

//FIXME: Needs API key.
export const isBuildEnvir = (frame: SessionFrame): boolean => {
  if (frame?.session === undefined) {
    // It's a bit confusing as to why this dodgy cast is needed. It took ages to get api keys working because of the
    // obscuriy of the workaround.
    // The top level query prefers SessionFrame, and does not build against KeystoneFrame (same, bar KeystoneContext for context)
    // This does appear to be the right way to access the context, but why do we need to
    // cast something as important as this?
    const kontext = frame?.context as KeystoneContext;
    const recvApiKey = kontext?.req?.headers['x-api-key'];

    if (recvApiKey === keystoneNextjsBuildApiKey) {
      if (recvApiKey.includes('keystone')) {
        log().warning('access: prototype api key: ' + recvApiKey);
      }
      log().success(
        'access::isBuildEnvir: next build: api key matches: granting super user query access.'
      );
      return true;
    } else {
      log()
        .warning('access::isBuildEnvir: authentication breach:')
        .success(
          'access::isBuildEnvir: no additional authorisation granted to breach.'
        );
      return false;
    }
  }
  return false;
};

export const isSignedIn = (context: KeystoneContext) => {
  /*
  const auth = useAuth();
  if (!auth.ready || !auth.sessionData)
    return false;

  return true;
*/
  if (!context) return false;
  if (!context?.session) return false;
  if (!context.sudo()?.session) return false;
  return true;
};

//They can't easy be expressed in terms of the more elementary functions either. undefined issues.
export const permissions = {
  canUseAdminUI: ({ session }: SessionContext): boolean =>
    Boolean(session?.data?.role),
  canManageContent: (frame: SessionFrame): boolean =>
    Boolean(frame?.context?.session?.data?.role?.canManageContent),
  canManageUsers: (frame: SessionFrame): boolean =>
    Boolean(frame?.context?.session?.data?.role?.canManageUsers),

  allow: <T>(frame: T) => drop(frame)(true),
  canManageContentSession: ({ session }: SessionContext): boolean => {
    return Boolean(session?.data?.role?.canManageContent);
  },
  canManageContentItem: (item: ItemContext): boolean =>
    Boolean(item?.session?.data?.role?.canManageContent),

  canManageUsersSession: ({ session }: SessionContext): boolean => {
    return Boolean(session?.data?.role?.canManageUsers);
  },
  canManageContentList: (frame: SessionFrame) =>
    permissions.canManageContent(frame),

  filterCanManageContentList: (frame: SessionFrame) => {
    if (frame === undefined) {
      log().reportSecurityIncident(
        'Minor security breach: potential auth bug. undefined frame: query downgraded to public.'
      );
      return PUBLISHED_POST_STATUS;
      //Give no information away that they have been noticed, but if there's no frame
      //it's hard to imagine where the reply is going to go ... if exec ever gets here, it's close
      //to a fatal error. What is the best thing to do here? Nothing? throw?
    }
    //Needs shared secret, set in bash, imported via process.env, usage tested in the CI workflow, which act as the base spec for a container to run keystone/next in.
    if (isBuildEnvir(frame)) {
      return true;
    }
    //The perms check is only running client side. Review: check the authorization props are checked
    //server side to.
    if (frame.context.session?.data?.role?.canManageContent ?? false) {
      log()
        .success('Blessed super user access to the known content manager:')
        .success(frame?.context?.session?.data?.name);
      return true;
    }

    log()
      .success('Client receives only published posts:')
      .success(frame?.context?.session?.data?.name);
    //success(frame.context.session?.data?.role?.canManageContent);
    return PUBLISHED_POST_STATUS;
  },
  filterCanManageUserList: (frame: SessionFrame) => {
    if (frame === undefined) {
      log().reportSecurityIncident(
        'Minor security breach: potential auth bug. undefined frame: query downgraded to public.'
      );
      return false;
      //Give no information away that they have been noticed, but if there's no frame
      //it's hard to imagine where the reply is going to go ... if exec ever gets here, it's close
      //to a fatal error. What is the best thing to do here? Nothing? throw?
    }
    //Needs shared secret, set in bash, imported via process.env, usage tested in the CI workflow, which act as the base spec for a container to run keystone/next in.
    if (isBuildEnvir(frame)) {
      return true;
    }
    //The perms check is only running client side. Review: check the authorization props are checked
    //server side to.
    if (frame.context.session?.data?.role?.canManageUsers ?? false) {
      log()
        .success('Blessed super user access to the known user manager:')
        .success(frame?.context?.session?.data?.name);
      return true;
    }

    log()
      .success('Client receives only their own user data:')
      .success(frame?.context?.session?.data?.name);
    //success(frame.context.session?.data?.role?.canManageContent);
    return { id: { equals: frame.context.session?.itemId ?? '' } };
  },
  isAuthenticatedFrontEndUser: (frame: SessionFrame) => {
    const context = frame.context as KeystoneContext;
    log().info(context);
    if (!isSignedIn(context)) return false;

    //const headers = context.req?.headers;

    //const host = headers ? headers['x-forwarded-host'] || headers['host'] : null;
    //const url = headers?.referer ? new URL(headers.referer) : undefined;

    return false;
  },
  filterCanManageUserListOrOnFrontEnd: (frame: SessionFrame) =>
    drop(frame)(true),

  /* {

    if (permissions.filterCanManageUserList(frame))
      return true;

    if (permissions.isAuthenticatedFrontEndUser(frame))
      return true;

    return  true;
    ;

  }  */
  canVoteInPolls: (frame: SessionFrame) => drop(frame)(true),
} as const;

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

// This is so important for a production server than does use gql only, that it might be worth
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

//       Core Issues located:
// auth/src/index.ts and related files in keystone core are triggering some "any" issues. Strong typing is (strongly) recommended.
// e.g.    const pageMiddleware: AdminUIConfig['pageMiddleware'] = async ({ context, isValidSession })
