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
import { schema, KeystoneListsAPI, KeystoneDbAPI } from '@keystone-next/types';
import { document } from '@keystone-next/fields-document';
import { createSchema, list } from '@keystone-next/keystone/schema';
import { KeystoneListsTypeInfo } from '.keystone/types';

const gql = ([content]: TemplateStringsArray) => content;

gql`
  type Mutation {
    voteForPoll(answerId: ID!): Boolean
  }
`;

export const lists = createSchema({
  Poll: list({
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
              if (
                context.session?.listKey === 'User' &&
                context.session.itemId
              ) {
                const lists = context.db
                  .lists as KeystoneDbAPI<KeystoneListsTypeInfo>;
                const pollAnswers = await lists.PollAnswer.findMany({
                  where: {
                    poll: { id: poll.id.toString() },
                    answeredByUsers_some: { id: context.session.itemId },
                  },
                });
                return pollAnswers[0];
              }
              return null;
            },
          }),
      }),
    },
  }),
  PollAnswer: list({
    fields: {
      label: text(),
      poll: relationship({ ref: 'Poll.answers' }),
      answeredByUsers: relationship({ ref: 'User.pollAnswers', many: true }),
    },
  }),
  User: list({
    fields: {
      name: text(),
      email: text({
        isUnique: true,
        isRequired: true,
      }),
      github: text(),
      repos: virtual({
        field: schema.field({
          type: schema.nonNull(
            schema.list(
              schema.object<{
                id: number;
                name: string;
                fullName: string;
                htmlUrl: string;
                description: string;
                createdAt: string;
                updatedAt: string;
                pushedAt: string;
                homepage: string;
                size: number;
                stargazersCount: number;
                watchersCount: number;
                language: string;
                forksCount: number;
              }>()({
                name: 'GitHub',
                fields: {
                  id: schema.field({ type: schema.Int }),
                  name: schema.field({ type: schema.String }),
                  fullName: schema.field({ type: schema.String }),
                  htmlUrl: schema.field({ type: schema.String }),
                  description: schema.field({ type: schema.String }),
                  createdAt: schema.field({ type: schema.String }),
                  updatedAt: schema.field({ type: schema.String }),
                  pushedAt: schema.field({ type: schema.String }),
                  homepage: schema.field({ type: schema.String }),
                  size: schema.field({ type: schema.Int }),
                  stargazersCount: schema.field({ type: schema.Int }),
                  watchersCount: schema.field({ type: schema.Int }),
                  language: schema.field({ type: schema.String }),
                  forksCount: schema.field({ type: schema.Int }),
                },
              })
            )
          ),
          async resolve(item: any) {
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
              return allRepos.map(
                ({
                  id,
                  name,
                  full_name,
                  html_url,
                  description,
                  created_at,
                  updated_at,
                  pushed_at,
                  homepage,
                  size,
                  stargazers_count,
                  watchers_count,
                  language,
                  forks_count,
                }) => ({
                  id,
                  name,
                  fullName: full_name,
                  htmlUrl: html_url,
                  description,
                  createdAt: created_at,
                  updatedAt: updated_at,
                  pushedAt: pushed_at,
                  homepage,
                  size,
                  stargazersCount: stargazers_count,
                  watchersCount: watchers_count,
                  language,
                  forksCount: forks_count,
                })
              );
            } catch (err) {
              console.error(err);
              return [];
            }
          },
        }),
        graphQLReturnFragment: '{ words sentences paragraphs }',
      }),
      password: password(),
      accessLevel: select({
        options: [
          { label: 'Visitor', value: 'visitor' },
          { label: 'Author', value: 'author' },
          { label: 'Content Manager', value: 'manager' },
          { label: 'Super User', value: 'admin' },
        ],
        defaultValue: 'visitor',
      }),
      authoredPosts: relationship({ ref: 'Post.author' }),
      pollAnswers: relationship({
        ref: 'PollAnswer.answeredByUsers',
        many: true,
      }),
    },
  }),
  Label: list({
    fields: {
      name: text(),
      posts: relationship({ ref: 'Post.labels', many: true }),
    },
  }),
  Post: list({
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
