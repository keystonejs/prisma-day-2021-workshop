import fetch from 'node-fetch';

import {
  checkbox,
  password,
  relationship,
  select,
  text,
  timestamp,
  virtual,
} from '@keystone-next/fields';
import {
  schema,
  KeystoneListsAPI,
  KeystoneDbAPI,
  KeystoneContext,
} from '@keystone-next/types';
import { document } from '@keystone-next/fields-document';
import {
  createSchema,
  graphQLSchemaExtension,
  list,
} from '@keystone-next/keystone/schema';
import { KeystoneListsTypeInfo } from '.keystone/types';

import { isSignedIn, permissions, rules } from './access';
import { componentBlocks } from './fields/Content';

const gql = ([content]: TemplateStringsArray) => content;

type Context = Omit<KeystoneContext, 'db' | 'lists'> & {
  db: { lists: KeystoneDbAPI<KeystoneListsTypeInfo> };
  lists: KeystoneListsAPI<KeystoneListsTypeInfo>;
};

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: gql`
    type Mutation {
      voteForPoll(answerId: ID!): Boolean
    }
  `,
  resolvers: {
    Mutation: {
      async voteForPoll(rootVal, { answerId }, _context) {
        const context = _context.sudo() as Context;
        if (!context.session) {
          return false;
        }

        const answers = await context.lists.PollAnswer.count({
          where: {
            poll: { answers_some: { id: answerId } },
            answeredByUsers_some: { id: context.session.itemId },
          },
        });
        if (answers > 0) {
          return false;
        }
        await context.lists.PollAnswer.updateOne({
          id: answerId,
          data: {
            answeredByUsers: { connect: { id: context.session.itemId } },
          },
        });
        return true;
      },
    },
  },
});

const GitHubRepo = schema.object<{
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  forks_count: number;
}>()({
  name: 'GitHubRepo',
  fields: {
    id: schema.field({ type: schema.Int }),
    name: schema.field({ type: schema.String }),
    fullName: schema.field({
      type: schema.String,
      resolve: val => val.full_name,
    }),
    htmlUrl: schema.field({
      type: schema.String,
      resolve: val => val.html_url,
    }),
    description: schema.field({ type: schema.String }),
    createdAt: schema.field({
      type: schema.String,
      resolve: val => val.created_at,
    }),
    updatedAt: schema.field({
      type: schema.String,
      resolve: val => val.updated_at,
    }),
    pushedAt: schema.field({
      type: schema.String,
      resolve: val => val.pushed_at,
    }),
    homepage: schema.field({ type: schema.String }),
    size: schema.field({ type: schema.Int }),
    stargazersCount: schema.field({
      type: schema.Int,
      resolve: val => val.stargazers_count,
    }),
    watchersCount: schema.field({
      type: schema.Int,
      resolve: val => val.watchers_count,
    }),
    language: schema.field({ type: schema.String }),
    forksCount: schema.field({
      type: schema.Int,
      resolve: val => val.forks_count,
    }),
  },
});

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
        graphQLReturnFragment: '{ id }',
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
      github: text(),
      repos: virtual({
        field: schema.field({
          type: schema.nonNull(schema.list(GitHubRepo)),
          async resolve(item: any) {
            // Note: without a personal github access token in your env, the server will be rate limited to 60 requests per hour
            // https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token
            try {
              const token = process.env.GITHUB_AUTH_TOKEN;
              const options = token
                ? { headers: { Authorization: `token ${token}` } }
                : undefined;
              const result = await fetch(
                `https://api.github.com/users/${item.github}/repos`,
                options
              );
              const allRepos = await result.json();
              return allRepos;
            } catch (err) {
              console.error(err);
              return [];
            }
          },
        }),
        graphQLReturnFragment: '{ fullName }',
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
      content: document({
        formatting: true,
        links: true,
        dividers: true,
        relationships: { poll: { listKey: 'Poll', kind: 'prop' } },
        componentBlocks,
        ui: { views: require.resolve('./fields/Content') },
      }),
      labels: relationship({ ref: 'Label.posts', many: true }),
    },
  }),
});
