import { relationship, text, virtual } from '@keystone-6/core/fields';
import { graphql, list } from '@keystone-6/core';
import { Lists, Context } from '.keystone/types';

import { isSignedIn, permissions } from './access';
import { contentListAccess, contentUIConfig } from './content';

export const Poll: Lists.Poll = list({
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
        resolve(poll, args, _context) {
          const context = _context as Context;
          return context.query.User.count({
            where: {
              pollAnswers: {
                some: { poll: { id: { equals: poll.id.toString() } } },
              },
            },
          });
        },
      }),
    }),
    userAnswer: virtual({
      field: lists =>
        graphql.field({
          type: lists.PollAnswer.types.output,
          async resolve(poll, args, _context) {
            const context = _context as Context;
            if (!isSignedIn(context)) return null;
            const pollAnswers = await context.db.PollAnswer.findMany({
              where: {
                poll: { id: { equals: poll.id.toString() } },
                answeredByUsers: {
                  some: { id: { equals: context.session.itemId } },
                },
              },
            });
            return pollAnswers[0];
          },
        }),
      ui: { query: '{ id label }' },
    }),
  },
});

export const PollAnswer: Lists.PollAnswer = list({
  access: contentListAccess,
  ui: contentUIConfig,
  fields: {
    label: text(),
    poll: relationship({ ref: 'Poll.answers' }),
    voteCount: virtual({
      field: graphql.field({
        type: graphql.Int,
        resolve(pollAnswer, args, _context) {
          const context = _context as Context;

          return context.query.User.count({
            where: {
              pollAnswers: {
                some: { id: { equals: pollAnswer.id.toString() } },
              },
            },
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
