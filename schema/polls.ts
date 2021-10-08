import { relationship, text, virtual } from '@keystone-next/keystone/fields';
import {graphql as schema } from '@keystone-next/keystone/types';
import { list } from '@keystone-next/keystone';
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
      isFilterable: true,
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
      field: schema.field({
        type: schema.Int,
        resolve(poll, args, context) {
          const lists = context.lists as KeystoneListsAPI;
          return lists.User.count({
            where: {
              pollAnswers: {some :{ poll: { id: { equals: poll.id.toString() }} }},
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
            const lists = context.db.lists as KeystoneDbAPI;
            const pollAnswers = await lists.PollAnswer.findMany({
              where: {
                poll: { id: {equals: poll.id.toString() }},
                answeredByUsers: {some: { id: {equals: context.session.itemId} }},
              },
            });
            return pollAnswers[0];
          },
        }),
      graphQLReturnFragment: '{ id label }',
    }),
  },
});

export const PollAnswer = list({
  access: contentListAccess,
  ui: contentUIConfig,
  fields: {
    label: text(),
    poll: relationship({isFilterable: true, ref: 'Poll.answers' }),
    voteCount: virtual({
      field: schema.field({
        type: schema.Int,
        resolve(pollAnswer, args, context) {
          const lists = context.lists as KeystoneListsAPI;

          return lists.User.count({
            where: { pollAnswers: { some: { id: {equals: pollAnswer.id.toString() } }} },
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
      isFilterable: true,
      ui: {
        displayMode: 'count',
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
      },
    }),
  },
});
