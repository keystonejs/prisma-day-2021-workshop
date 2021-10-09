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



export type ItemContext = { item: any } & SessionContext;

export const isSignedIn = ({ session }: SessionContext) => {
  return !!session;
};

export const permissions = {
  canManageContent: ({ session }: SessionContext) => {
    return !!session?.data.role?.canManageContent;
  },
  canManageUsers: ({ session }: SessionContext) => {
    return !!session?.data.role?.canManageUsers;
  },
};

export const rules = {
  canUseAdminUI: ({ session }: SessionContext) => {
    return !!session?.data.role;
  },
  canReadContentList: ({ session }: SessionContext)  => {
    if (!permissions.canManageContent({ session })) return false;
    //return { status: 'published' };
    return true;
  },
  filterCanReadContentList: ({ session }: SessionContext) => {
    return {OR: [{canManageContent: { equals: true }}, {status: {equals: 'published'}}]} 
  },
  canManageUser: ( { session, item }: ItemContext ) => {
    if (!permissions.canManageUsers({ session  })) return false;
    if (session?.itemId !== item.id) return false;
    return true;
  },
  operationCanManageUserList: ({ session }: SessionContext)  => {
    if (!permissions.canManageUsers({ session })) return false;
    if (!isSignedIn({ session })) 
      return false;
    return true;
  },
  filterCanManageUserList: ({ session }: SessionContext) => {
      return {where: {OR: [{canManageUsers: { equals: true }}, {id: { equals: session!.itemId }}]}} 
  }
};
