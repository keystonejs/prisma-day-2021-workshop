import { relationship, text, virtual } from '@keystone-next/keystone/fields';
import { graphql, list } from '@keystone-next/keystone';
import {
  KeystoneContext,
  KeystoneListsAPI,
  KeystoneDbAPI,
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
        resolve(pollAnswer, args, context) {
          const lists = context.query as KeystoneListsAPI;

          return lists.User.count({
            where: {
              pollAnswers: {
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
        read: permissions.canVoteInPolls,
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
      field: graphql.field({
        type: graphql.Int,
        resolve(poll, args, context) {
          const lists = context.query as KeystoneListsAPI;
          return lists.User.count({
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
          resolve(poll, args, context) {
            if (!isSignedIn(context as KeystoneContext)) {
              return null;
            }
            const lists = context.db as KeystoneDbAPI;
            return makeIO(
              () =>
                lists.PollAnswer.findMany({
                  where: {
                    poll: { id: { equals: poll.id.toString() } },
                    answeredByUsers: {
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
