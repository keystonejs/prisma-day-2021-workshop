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

export type MiniSessionFrame = { 
  session: ItemContext,
  context: SessionContext,
}

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
  canUseAdminUI: ({ session }: SessionContext) : boolean => {
    return !!session?.data?.role;
  },
  canReadContentList: ({ session }: SessionContext) : boolean => {
    //if (permissions.canManageContent({ session })) return true;
    //return { status: 'published' };
    return true;
  },
  filterCanReadContentList: ({ session }: SessionContext) => {
    return {OR: [{canManageContent: { equals: true }}, {status: {equals: 'published'}}]} 
  },
  canManageUser: ( session : ItemContext, context : SessionContext   ) : boolean => {
    if (permissions.canManageUsers( session )) return true;
    if (session?.itemId === item.id) return true;
    return false;
  },
  operationCanManageUserList: ({ session, context  } : MiniSessionFrame) : boolean => {
    if (permissions.canManageUsers( session )) return true;
    if (!isSignedIn( session )) 
      return false;
    return true;
  },
  filterCanManageUserList: ( session : ItemContext, context  : SessionContext   ) => {
      return {OR: [{canManageUsers: { equals: true }}, {AND: [{id: {equals: context?.itemId}}, {id: {equals: context.itemId}}]}]} 
  }
};
