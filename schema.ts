import {
  checkbox,
  password,
  relationship,
  select,
  text,
  timestamp,
  virtual,
} from '@keystone-next/fields';
import { schema, KeystoneListsAPI, KeystoneDbAPI } from '@keystone-next/types';
import { document } from '@keystone-next/fields-document';
import { createSchema, list } from '@keystone-next/keystone/schema';
import { KeystoneListsTypeInfo } from '.keystone/types';

import { isSignedIn, permissions, rules } from './access';

const gql = ([content]: TemplateStringsArray) => content;

gql`
  type Mutation {
    voteForPoll(answerId: ID!): Boolean
  }
`;

export const lists = createSchema({
  Poll: list({
    access: {
      read: true,
      create: permissions.canManageContent,
      update: permissions.canManageContent,
      delete: permissions.canManageContent,
    },
    fields: {
      label: text(),
      isOpen: checkbox(),
      answers: relationship({ ref: 'PollAnswer.poll', many: true }),
      responsesCount: virtual({
        field: schema.field({
          type: schema.Int,
          resolve(poll, args, context) {
            const lists =
              context.lists as KeystoneListsAPI<KeystoneListsTypeInfo>;
            return lists.User.count({
              where: {
                pollAnswers_some: { poll: { id: poll.id.toString() } },
              },
            });
          },
        }),
      }),
      userAnswer: virtual({
        field: lists =>
          schema.field({
            type: lists.PollAnswer.types.output,
            async resolve(poll, args, context) {
              if (!isSignedIn(context)) return null;
              const lists = context.db
                .lists as KeystoneDbAPI<KeystoneListsTypeInfo>;
              const pollAnswers = await lists.PollAnswer.findMany({
                where: {
                  poll: { id: poll.id.toString() },
                  answeredByUsers_some: { id: context.session.itemId },
                },
              });
              return pollAnswers[0];
            },
          }),
      }),
    },
  }),
  PollAnswer: list({
    access: {
      read: true,
      create: permissions.canManageContent,
      update: permissions.canManageContent,
      delete: permissions.canManageContent,
    },
    fields: {
      label: text(),
      poll: relationship({ ref: 'Poll.answers' }),
      voteCount: virtual({
        field: schema.field({
          type: schema.Int,
          resolve(pollAnswer, args, context) {
            const lists =
              context.lists as KeystoneListsAPI<KeystoneListsTypeInfo>;

            return lists.User.count({
              where: { pollAnswers_some: { id: pollAnswer.id.toString() } },
            });
          },
        }),
      }),
      answeredByUsers: relationship({
        ref: 'User.pollAnswers',
        many: true,
        access: { read: permissions.canManageContent },
      }),
    },
  }),
  User: list({
    access: {
      create: true,
      read: true,
      update: rules.canManageUserList,
      delete: rules.canManageUserList,
    },
    fields: {
      name: text(),
      email: text({
        isUnique: true,
        isRequired: true,
        access: {
          read: rules.canManageUser,
        },
      }),
      password: password({ isRequired: true }),
      role: relationship({
        ref: 'Role.users',
        access: permissions.canManageUsers,
      }),
      authoredPosts: relationship({
        ref: 'Post.author',
        access: { update: permissions.canManageContent },
      }),
      pollAnswers: relationship({
        ref: 'PollAnswer.answeredByUsers',
        many: true,
        access: permissions.canManageUsers,
      }),
    },
  }),
  Role: list({
    access: permissions.canManageUsers,
    fields: {
      name: text(),
      canManageContent: checkbox({ defaultValue: false }),
      canManageUsers: checkbox({ defaultValue: false }),
      users: relationship({ ref: 'User.role', many: true }),
    },
  }),
  Label: list({
    access: {
      create: permissions.canManageContent,
      update: permissions.canManageContent,
      delete: permissions.canManageContent,
    },
    fields: {
      name: text(),
      posts: relationship({ ref: 'Post.labels', many: true }),
    },
  }),
  Post: list({
    access: {
      read: rules.canReadContentList,
      create: permissions.canManageContent,
      update: permissions.canManageContent,
      delete: permissions.canManageContent,
    },
    fields: {
      title: text(),
      slug: text(),
      status: select({
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Published', value: 'published' },
          { label: 'Arhived', value: 'archived' },
        ],
        defaultValue: 'draft',
        ui: { displayMode: 'segmented-control' },
      }),
      publishedDate: timestamp(),
      author: relationship({ ref: 'User.authoredPosts' }),
      content: document({ formatting: true, links: true, dividers: true }),
      labels: relationship({ ref: 'Label.posts', many: true }),
    },
  }),
});
