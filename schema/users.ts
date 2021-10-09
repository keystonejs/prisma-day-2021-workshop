import {
  checkbox,
  password,
  relationship,
  text,
  virtual,
} from '@keystone-next/keystone/fields';

import {graphql} from '@keystone-next/keystone';
import { list } from '@keystone-next/keystone';

import { permissions, rules, SessionContext} from './access';
import { GitHubRepo, githubReposResolver } from './fields/githubRepos/field';
import { KeystoneContext} from '.keystone/types';

type SessionFrame = {
  session: any,
  context: SessionContext,
  listKey: string,
  operation: string
}

const fieldModes = {
  editSelfOrRead: ({ session, item }: any) =>
    permissions.canManageUsers({ session }) || session.itemId === item.id
      ? 'edit'
      : 'read',
  editSelfOrHidden: ({ session, item }: any) =>
    permissions.canManageUsers({ session }) || session.itemId === item.id
      ? 'edit'
      : 'hidden',
};

export const User = list({
  access: {
    operation: {
      create: ({ session, context, listKey, operation } : SessionFrame) => true,
      query: ({ session, context, listKey, operation } : SessionFrame) => true,
      update: ({ session, context, listKey, operation } : SessionFrame) => rules.operationCanManageUserList(session),
      delete: ({ session, context, listKey, operation } : SessionFrame) => rules.operationCanManageUserList(session),
    },
    filter: {
      update: ({ session, context, listKey, operation } : SessionFrame) => rules.filterCanManageUserList,
      delete: ({ session, context, listKey, operation } : SessionFrame) => rules.filterCanManageUserList
    }

  },

  ui: {
    hideCreate: (context: SessionContext) => !permissions.canManageUsers(context),
    hideDelete: (context: SessionContext) => !permissions.canManageUsers(context),
    itemView: {
      defaultFieldMode: (context: SessionContext) =>
        permissions.canManageUsers(context) ? 'edit' : 'hidden',
    },
    listView: {
      defaultFieldMode: (context: SessionContext) =>
        permissions.canManageUsers(context) ? 'read' : 'hidden',
    },
  },
  fields: {
    name: text({
      ui: {
        itemView: { fieldMode: fieldModes.editSelfOrRead },
      },
    }),
    email: text({
      isIndexed: 'unique', 
      isFilterable: true,
      access: {
        read: rules.canManageUser,
      },
      ui: {
        itemView: { fieldMode: fieldModes.editSelfOrHidden },
      },
    }),
    password: password({
      ui: {
        itemView: { fieldMode: fieldModes.editSelfOrHidden },
      },
    }),
    role: relationship({
      ref: 'Role.users',
      access: permissions.canManageUsers,
    }),
    githubUsername: text({
      isFilterable: true,
      label: 'GitHub Username',
      ui: {
        itemView: { fieldMode: fieldModes.editSelfOrRead },
      },
    }),
    githubRepos: virtual({
      field: graphql.field({
        type: graphql.nonNull(graphql.list(GitHubRepo)),
        resolve: githubReposResolver,
      }),
      ui: {
        views: require.resolve('./fields/githubRepos/components'),
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
        query:
          '{ name htmlUrl description homepage stargazersCount }'
      },
    }),
    authoredPosts: relationship({
      ref: 'Post.author',
      isFilterable: true,
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
      },
    }),
    pollAnswers: relationship({
      ref: 'PollAnswer.answeredByUsers',
      isFilterable: true,
      many: true,
      access: permissions.canManageUsers,
      ui: {
        hideCreate: true,
        createView: { fieldMode: 'hidden' },
      },
    }),
  },
});

export const Role = list({
  
    
    fields: {
      name: text(),
      canManageContent: checkbox({ defaultValue: false }),
      canManageUsers: checkbox({ defaultValue: false }),
      users: relationship({ ref: 'User.role', many: true })
    },
    
    access: {  
      filter: {
        query: ({ session, context, listKey, operation } : SessionFrame) => 
        { 
          return { canManageUsers: { equals: true } };
        },
        update: ({ session, context, listKey, operation } : SessionFrame) => 
        { 
          return { canManageUsers: { equals: true } };
        },
        delete: ({ session, context, listKey, operation }  : SessionFrame) => 
        { 
          return { canManageUsers: { equals: true } };
        }
    }
  },
  //permissions.canManageUsers,
  ui: {
    isHidden:  (context: SessionContext) => !permissions.canManageUsers(context),
  },

});
