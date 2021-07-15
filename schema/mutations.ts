import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import {
  KeystoneListsAPI,
  KeystoneDbAPI,
  KeystoneContext,
} from '@keystone-next/types';
import { KeystoneListsTypeInfo, PollWhereInput } from '.keystone/types';

const gql = ([content]: TemplateStringsArray) => content;

type Context = Omit<KeystoneContext, 'db' | 'lists'> & {
  db: { lists: KeystoneDbAPI<KeystoneListsTypeInfo> };
  lists: KeystoneListsAPI<KeystoneListsTypeInfo>;
};

async function clearVote(
  _context: KeystoneContext,
  pollFilter: PollWhereInput
) {
  const context = _context.sudo() as Context;
  if (!context.session) {
    throw new Error('You must be signed in to vote');
  }

  const answers = await context.db.lists.PollAnswer.findMany({
    where: {
      poll: pollFilter,
      answeredByUsers_some: { id: context.session.itemId },
    },
  });

  if (answers.length) {
    await context.db.lists.PollAnswer.updateMany({
      data: answers.map(answer => ({
        id: answer.id,
        data: {
          answeredByUsers: { disconnect: { id: context.session.itemId } },
        },
      })),
    });
  }
}

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: gql`
    type Mutation {
      voteForPoll(answerId: ID!): Boolean
      clearVoteForPoll(pollId: ID!): Boolean
    }
  `,
  resolvers: {
    Mutation: {
      async clearVoteForPoll(rootVal, { pollId }, _context) {
        await clearVote(_context, { id: pollId });
      },
      async voteForPoll(rootVal, { answerId }, _context) {
        const context = _context.sudo() as Context;
        clearVote(context, { answers_some: { id: answerId } });
        await context.db.lists.PollAnswer.updateOne({
          id: answerId,
          data: {
            answeredByUsers: { connect: { id: context.session.itemId } },
          },
        });
      },
    },
  },
});
