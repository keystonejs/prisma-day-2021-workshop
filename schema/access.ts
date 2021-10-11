import {KeystoneContext} from '.keystone/types'

const { withKeystone } = require("@keystone-next/keystone/next");

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

const unit = {}
const rmap_va = (...props: any) => (f: any) => {
  props.forEach((element: any )=> {
    f(element)
  });
}

let colors = require('colors/safe');

const warn = (...obj: any) => 
  rmap_va(obj) 
    ((x : any) => 
      console.log(colors.yellow(x.toString())))


const xwarn = (...obj: any) => unit


export const IsBuildEnvir = (frame:  SessionFrame) : boolean =>
{
  if (frame.session === undefined)
  {
    let localWarn = (...msgs: any) => warn ("Access::IsBuildEnvir: Undefined session:",...msgs)


    localWarn("authentication breach:", frame)
    localWarn("Assuming next build event is an SSG or ISG event.")
    localWarn("Blessing assumed next build authorisation breach permissisons for super user queries.")
    //localWarn("withKeysone code", withKeystone)
    return true 
  }
  return false
}



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
  operationCanManageContentList: ({item}: ItemContext)  => {
    console.log("rules.operationCanReadContentList");
    if (!permissions.canManageContent(item)) return false;
 
    return true;
  },
  filterCanReadContent: () => {
    console.log("rules.filterCanReadContent");
    return  {status: {equals: 'published'}} 
  },
  canReadContentList: ({item}: ItemContext)  => {
    console.log("rules.canReadContentList");
    if (!permissions.canManageContent(item)) return false;
 
    return true;
  },

  canManageUser: ( {  item, session }: ItemContext ) => {
    if (!permissions.canManageUsers({ session  })) return false;
    if (session?.itemId !== item?.id) return false;
    return true;
  },
  operationCanManageUserList: ({ session }: SessionContext)  => {
    if (!isSignedIn({ session })) 
    return false;
    if (permissions.canManageUsers({ session })) return true;

    return false;
  },
  filterCanManageUserList: ({item,session}: ItemContext) => {
    return {canManageUsers: {equals: true}}
  }
};

export const OperationCanManageContentList = ({ session, context, listKey, operation } : SessionFrame) => 
  rules.operationCanManageContentList(session)

export const EVERYTHING = {status: {in: ['published','draft','archive']}}

export const FilterCanManageContentList = (frame: SessionFrame) => {
   if (IsBuildEnvir(frame)) return EVERYTHING
   if (!!permissions?.canManageContent( frame.session ) ) 
      return EVERYTHING
   return {status: {in: ['published']}} 
}