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

    warn('undefined frame.session');
    warn('Assuming an SSG or ISG build event.');
    warn(
      'Assumed next build authentication breach: Blessing next build with super user queries.'
    );
    warn('');
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
    console.log('Typeof session: ' + typeof session);
    return !!session?.data.role as MaybePromise<boolean>;
  },
  operationCanManageContentList: ({ item }: ItemContext) => {
    warn('rules.operationCanReadContentList');
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
      'Minor security breach: undefined frame: query downgraded to public.'
    );
    //Give no information away that they have been noticed
    return PUBLISHED_POST_STATUS;
  }
  if (isBuildEnvir(frame) || !!permissions?.canManageContent(frame.session)) {
    success('Blessed super user access');
    return EVERY_POST_STATUS;
  }
  success('Client receives only published posts');
  return PUBLISHED_POST_STATUS;
};
