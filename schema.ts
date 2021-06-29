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
