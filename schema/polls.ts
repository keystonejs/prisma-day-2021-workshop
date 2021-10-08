import { relationship, text, virtual } from '@keystone-next/keystone/fields';
import { graphql, list } from '@keystone-next/keystone';
import { KeystoneListsAPI, KeystoneDbAPI } from '.keystone/types';

import { isSignedIn, permissions } from './access';
import { contentListAccess, contentUIConfig } from './content';

export const Poll = list({
  access: contentListAccess,
  ui: contentUIConfig,
  fields: {
    label: text(),
    answers: relationship({
      ref: 'PollAnswer.poll',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['label', 'voteCount'],
        inlineCreate: {
          fields: ['label'],
        },
        inlineEdit: {
          fields: ['label'],
        },
        removeMode: 'disconnect',
        inlineConnect: true,
      },
    }),
    responsesCount: virtual({
      field: graphql.field({
        type: graphql.Int,
        resolve(poll, args, context) {
          const lists = context.query as KeystoneListsAPI;
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
        graphql.field({
          type: lists.PollAnswer.types.output,
          async resolve(poll, args, context) {
            if (!isSignedIn(context)) return null;
            const lists = context.db.lists as KeystoneDbAPI;
            const pollAnswers = await lists.PollAnswer.findMany({
              where: {
                poll: { id: poll.id.toString() },
                answeredByUsers_some: { id: context.session.itemId },
              },
            });
            return pollAnswers[0];
          },
        }),
      ui: { query: '{ id label }' },
    }),
  },
});

export const PollAnswer = list({
  access: contentListAccess,
  ui: contentUIConfig,
  fields: {
    label: text(),
    poll: relationship({ ref: 'Poll.answers' }),
    voteCount: virtual({
      field: graphql.field({
        type: graphql.Int,
        resolve(pollAnswer, args, context) {
          const lists = context.query as KeystoneListsAPI;

          return lists.User.count({
            where: { pollAnswers_some: { id: pollAnswer.id.toString() } },
          });
        },
      }),
      ui: {
        itemView: { fieldMode: 'hidden' },
      },
    }),
    answeredByUsers: relationship({
      ref: 'User.pollAnswers',
      many: true,
      access: { read: permissions.canManageContent },
      ui: {
        displayMode: 'count',
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
      },
    }),
  },
});
