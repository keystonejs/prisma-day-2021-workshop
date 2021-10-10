import {
  checkbox,
  password,
  relationship,
  text,
  virtual,
} from '@keystone-next/keystone/fields';

import {graphql} from '@keystone-next/keystone';
import { list } from '@keystone-next/keystone';

import { permissions, rules, SessionContext, SessionFrame, ItemContext} from './access';
import { GitHubRepo, githubReposResolver } from './fields/githubRepos/field';





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
      update: rules.filterCanManageUserList,
      delete: rules.filterCanManageUserList
    }

  },

  ui: {
    hideCreate: (session: SessionContext) => !permissions.canManageUsers(session),
    hideDelete: (session: SessionContext) => !permissions.canManageUsers(session),
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
        read: ({ session, context, listKey, operation } : SessionFrame) => rules.canManageUser(session),
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
        query: rules.filterCanManageUserList,
        update: rules.filterCanManageUserList,
        delete: rules.filterCanManageUserList,
    }
  },
  //permissions.canManageUsers,
  ui: {
    isHidden:  (session) => !permissions.canManageUsers(session),
  },

});
