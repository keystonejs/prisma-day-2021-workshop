
import {KeystoneContext} from '.keystone/types'
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
  session: ItemContext,
  context: SessionContext,
  listKey: string,
  operation: string
}

export type ItemContext = { item: any } & SessionContext;

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
  canUseAdminUI: ( { session }: SessionContext ) => {
    console.log("Typeof session: " + typeof(session))
    return !!session?.data.role as MaybePromise<boolean>;
  },
  canReadContentList: ({ session }: SessionContext)  => {
    console.log("rules.canReadContentList");
    if (!permissions.canManageContent({ session })) return false;
 
    return true;
  },
  filterCanReadContentList: ({ session }: SessionContext) => {
    console.log("rules.filterCanReadContentList");
    return {status: {equals: 'published'}} 
  },
  canManageUser: ( {  item, session }: ItemContext ) => {
    if (!permissions.canManageUsers({ session  })) return false;
    if (session?.itemId !== item?.id) return false;
    return true;
  },
  operationCanManageUserList: ({ item, session }: ItemContext)  => {
    if (!isSignedIn({ session })) 
    return false;
    if (permissions.canManageUsers({ session })) return true;

    return false;
  },
  filterCanManageUserList: ({item,session}: ItemContext) => {
    return {true: {equals: true}}
  }
};
