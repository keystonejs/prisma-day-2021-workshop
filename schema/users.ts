import {
  checkbox,
  password,
  relationship,
  text,
  virtual,
} from '@keystone-6/core/fields';

import { graphql, list } from '@keystone-6/core';

import {
  permissions,
  SessionContext,
  ItemContext,
  EDIT,
  READ,
  HIDDEN,
} from './access';
import { GitHubRepo, githubReposResolver } from './fields/githubRepos/field';

//import { log } from '../utils/logging';

const fieldModes = {
  editSelfOrRead: ({ session, item }: ItemContext) =>
    permissions.canManageUsersSession({ session }) ||
    session?.itemId === item.id
      ? EDIT
      : READ,
  editSelfOrHidden: ({ session, item }: ItemContext) =>
    permissions.canManageUsersSession({ session }) ||
    session?.itemId === item.id
      ? EDIT
      : HIDDEN,
  readIfCanManageUsersOrHidden: (context: SessionContext) =>
    permissions.canManageUsersSession(context) ? READ : HIDDEN,
} as const;

export const User = list({
  access: {
    operation: {
      create: permissions.allow,
      query: permissions.allow,
      update: permissions.canManageUsers,
      delete: permissions.canManageUsers,
    },

    filter: {
      //If this line is not strict, CUIDs are exposed, If its not, then only userman can count polls.
      query: permissions.filterCanManageUserListOrOnFrontEnd,
      //update:
      //  permissions.filterCanManageUserList,
    },
  },

  ui: {
    hideCreate: !permissions.canManageUsersSession,
    hideDelete: !permissions.canManageUsersSession,
    itemView: {
      defaultFieldMode: fieldModes.editSelfOrHidden,
    },
    listView: {
      defaultFieldMode: fieldModes.readIfCanManageUsersOrHidden,
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
        read: permissions.canManageUsers,
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
      isFilterable: true,
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
        createView: { fieldMode: HIDDEN },
        listView: { fieldMode: HIDDEN },
        itemView: { fieldMode: READ },
        query: '{ name htmlUrl description homepage stargazersCount }',
      },
    }),
    authoredPosts: relationship({
      ref: 'Post.author',
      isFilterable: true,
      many: true,
      ui: {
        createView: { fieldMode: HIDDEN },
      },
    }),
    pollAnswers: relationship({
      ref: 'PollAnswer.answeredByUsers',
      isFilterable: true,
      many: true,
      access: permissions.canManageUsers,
      ui: {
        hideCreate: true,
        createView: { fieldMode: HIDDEN },
      },
    }),
  },
} as const);

export const Role = list({
  fields: {
    name: text(),
    canManageContent: checkbox({ defaultValue: false, isFilterable: true }),
    canManageUsers: checkbox({ defaultValue: false, isFilterable: true }),
    users: relationship({ ref: 'User.role', many: true, isFilterable: true }),
  },

  access: {
    operation: {
      query: permissions.canManageUsers,
      update: permissions.canManageUsers,
      delete: permissions.canManageUsers,
    },
  },
  //permissions.canManageUsers,
  ui: {
    isHidden: <T>(session: T) => !permissions.canManageUsersSession(session),
  },
} as const);
