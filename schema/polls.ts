import { relationship, text, virtual } from '@keystone-6/core/fields';
import { graphql, list } from '@keystone-6/core';
import {
  Context
} from '.keystone/types';

import { isSignedIn, permissions, HIDDEN } from './access';
import { contentListAccess, contentUIConfig } from './content';
import { makeIO } from '../utils/maybeIOPromise';
import { PollAnswerAny } from '../wrap_any';

export const PollAnswer = list({
  access: contentListAccess,
  ui: contentUIConfig,
  fields: {
    label: text(),
    poll: relationship({ isFilterable: true, ref: 'Poll.answers' }),
    voteCount: virtual({
      field: graphql.field({
        type: graphql.Int,
        resolve(pollAnswer, args, _context) {
          const context = _context as Context;

          return context.query.User.count({
            where: {
              pollAnswers: {
                // @ts-ignore
                some: { id: { equals: pollAnswer.id.toString() } },
              },
            },
          });
        },
      }),
      access: permissions.canVoteInPolls,

      ui: {
        itemView: { fieldMode: HIDDEN },
      },
    }),
    answeredByUsers: relationship({
      ref: 'User.pollAnswers',
      isFilterable: true,
      many: true,
      access: {
        read: permissions.canManageUsers,
      },
      ui: {
        displayMode: 'count',
        createView: { fieldMode: HIDDEN },
        listView: { fieldMode: HIDDEN },
      },
    }),
  },
} as const);

export const Poll = list({
  access: contentListAccess,
  ui: contentUIConfig,
  fields: {
    label: text(),
    answers: relationship({
      ref: 'PollAnswer.poll',
      isFilterable: true,
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
      access: permissions.canVoteInPolls,
      field: graphql.field({
        type: graphql.Int,

        resolve(poll, args, _context) {
          const context = _context as Context;

          return context.query.User.count({
            where: {
              pollAnswers: {
                // @ts-ignore
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
          resolve(poll, args, _context) {
            const context = _context as Context;
            if (!isSignedIn(context)) {
              return null;
            }
            return makeIO(
              () =>
                  context.db.PollAnswer.findMany({
                  where: {
                    // @ts-ignore
                    poll: { id: { equals: poll.id.toString() } },
                    answeredByUsers: {
                      // @ts-ignore
                      some: { id: { equals: context.session.itemId } },
                    },
                  },
                }) as Promise<Array<PollAnswerAny>>
            )
              .then(x => x[0])
              .run();
          },
        }),
      ui: { query: '{ id label }' },
    }),
  },
} as const);
