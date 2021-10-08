import {
  checkbox,
  password,
  relationship,
  text,
  virtual,
} from '@keystone-next/keystone/fields';
import { list, graphql } from '@keystone-next/keystone';

import { permissions, rules } from './access';
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
      create: () => true,
    },
    filter: {
      query: () => true,
      update: rules.canManageUserList,
      delete: rules.canManageUserList,
    }
  },
  ui: {
    hideCreate: context => !permissions.canManageUsers(context),
    hideDelete: context => !permissions.canManageUsers(context),
    itemView: {
      defaultFieldMode: context =>
        permissions.canManageUsers(context) ? 'edit' : 'hidden',
    },
    listView: {
      defaultFieldMode: context =>
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
      validation: {
        isRequired: true,
      },
      access: {
        read: rules.canManageUser,
      },
      ui: {
        itemView: { fieldMode: fieldModes.editSelfOrHidden },
      },
    }),
    password: password({
      validation: {
        isRequired: true,
      },
      ui: {
        itemView: { fieldMode: fieldModes.editSelfOrHidden },
      },
    }),
    role: relationship({
      ref: 'Role.users',
      access: permissions.canManageUsers,
    }),
    githubUsername: text({
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
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
      },
    }),
    pollAnswers: relationship({
      ref: 'PollAnswer.answeredByUsers',
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
  access: {
    filter: {
      delete: permissions.canManageUsers,
      query: permissions.canManageUsers,
      update: permissions.canManageUsers,
    }
  },
  ui: {
    isHidden: context => !permissions.canManageUsers(context),
  },
  fields: {
    name: text(),
    canManageContent: checkbox({ defaultValue: false }),
    canManageUsers: checkbox({ defaultValue: false }),
    users: relationship({ ref: 'User.role', many: true }),
  },
});
