import {
  checkbox,
  password,
  relationship,
  text,
  virtual,
} from '@keystone-next/keystone/fields';

import { graphql, list } from '@keystone-next/keystone';

import {
  permissions,
  SessionContext,
  ItemContext,
  SessionFrame,
  //FilterFrame,
  EDIT,
  READ,
  HIDDEN,
} from './access';
import { GitHubRepo, githubReposResolver } from './fields/githubRepos/field';

import { KeystoneContext } from '.keystone/types';
import { SessionAny } from '../wrap_any';

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
};

declare type BaseAccessArgs = {
  session: SessionAny;
  listKey: string;
  context: KeystoneContext;
};

declare type LocalAccessArgs = {
  session: SessionContext;
  listKey: string;
  context: KeystoneContext;
};

export const User = list({
  access: {
    operation: {
      create: (frame: SessionFrame) => true,
      query: (frame: SessionFrame) => true,
      update: (frame: SessionFrame) => permissions.canManageUsers(frame),
      delete: (frame: SessionFrame) => permissions.canManageUsers(frame),
    },

    filter: {
      query: (frame: SessionFrame) =>
        permissions.filterCanManageUserList(frame),
      update: (frame: SessionFrame) =>
        permissions.filterCanManageUserList(frame),
    },
  },

  ui: {
    hideCreate: (session: SessionContext) =>
      !permissions.canManageUsersSession(session),
    hideDelete: (session: SessionContext) =>
      !permissions.canManageUsersSession(session),
    itemView: {
      defaultFieldMode: (context: SessionContext) =>
        permissions.canManageUsersSession(context) ? EDIT : HIDDEN,
    },
    listView: {
      defaultFieldMode: (context: SessionContext) =>
        permissions.canManageUsersSession(context) ? READ : HIDDEN,
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
        read: (frame: SessionFrame) => permissions.canManageUsers(frame),
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
});

export const Role = list({
  fields: {
    name: text(),
    canManageContent: checkbox({ defaultValue: false, isFilterable: true }),
    canManageUsers: checkbox({ defaultValue: false, isFilterable: true }),
    users: relationship({ ref: 'User.role', many: true, isFilterable: true }),
  },

  access: {
    operation: {
      query: (frame: SessionFrame) => permissions.canManageUsers(frame),
      update: (frame: SessionFrame) => permissions.canManageUsers(frame),
      delete: (frame: SessionFrame) => permissions.canManageUsers(frame),
    },
  },
  //permissions.canManageUsers,
  ui: {
    isHidden: session => !permissions.canManageUsersSession(session),
  },
});
