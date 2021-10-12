import {
  checkbox,
  password,
  relationship,
  text,
  virtual,
} from '@keystone-next/keystone/fields';

import { graphql } from '@keystone-next/keystone';
import { list } from '@keystone-next/keystone';

import {
  permissions,
  SessionContext,
  SessionFrame,
  ItemContext,
} from './access';
import { GitHubRepo, githubReposResolver } from './fields/githubRepos/field';

// Removed an any, revealed an extra ? was required ! any = js ;) any is to be avoid like the plague unless trying to type compose ;)
// strong type for any type.
// That generic "cant assign to Maybe..." error seems be trying to say "There's an any, which is potentially undefined, but is not triggering a type error"
// On that not, I counted occurence of ": any" in the repo. 5902 results in 793 files :-O. Not good, since each hides a potential bug that is hiding
// from ts, like occured here.
const fieldModes = {
  editSelfOrRead: ({ session, item }: ItemContext) =>
    permissions.canManageUsersSession({ session }) ||
    session?.itemId === item.id
      ? 'edit'
      : 'read',
  editSelfOrHidden: ({ session, item }: ItemContext) =>
    permissions.canManageUsersSession({ session }) ||
    session?.itemId === item.id
      ? 'edit'
      : 'hidden',
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
      update: (frame: SessionFrame) => permissions.canManageUsers(frame),
      //delete: ({ session, context, listKey, operation } : SessionFrame) => rules.filterCanManageUserList(session)
    },
  },

  ui: {
    hideCreate: (session: SessionContext) =>
      !permissions.canManageUsersSession(session),
    hideDelete: (session: SessionContext) =>
      !permissions.canManageUsersSession(session),
    itemView: {
      defaultFieldMode: (context: SessionContext) =>
        permissions.canManageUsersSession(context) ? 'edit' : 'hidden',
    },
    listView: {
      defaultFieldMode: (context: SessionContext) =>
        permissions.canManageUsersSession(context) ? 'read' : 'hidden',
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
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
        query: '{ name htmlUrl description homepage stargazersCount }',
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
