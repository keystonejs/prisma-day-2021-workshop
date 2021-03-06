import { graphQLSchemaExtension } from '@keystone-6/core';
import { Context, PollWhereInput } from '.keystone/types';

const gql = ([content]: TemplateStringsArray) => content;

async function clearVote(_context: Context, pollFilter: PollWhereInput) {
  const context = _context.sudo();
  if (!context.session) {
    throw new Error('You must be signed in to vote');
  }

  const answers = await context.db.PollAnswer.findMany({
    where: {
      poll: pollFilter,
      answeredByUsers: { some: { id: { equals: context.session.itemId } } },
    },
  });

  if (answers.length) {
    await context.db.PollAnswer.updateMany({
      data: answers.map((answer: any) => ({
        where: { id: answer.id },
        data: {
          answeredByUsers: { disconnect: { id: context.session.itemId } },
        },
      })),
    });
  }
}

export const extendGraphqlSchema = graphQLSchemaExtension<Context>({
  typeDefs: gql`
    type Mutation {
      voteForPoll(answerId: ID!): Boolean
      clearVoteForPoll(pollId: ID!): Boolean
    }
  `,
  resolvers: {
    Mutation: {
      async clearVoteForPoll(rootVal, { pollId }: { pollId: string }, context) {
        await clearVote(context, { id: { equals: pollId } });
      },
      async voteForPoll(rootVal, { answerId }: { answerId: string }, _context) {
        const context = _context.sudo();
        clearVote(context, { answers: { some: { id: { equals: answerId } } } });
        await context.db.PollAnswer.updateOne({
          where: { id: answerId },
          data: {
            answeredByUsers: { connect: { id: context.session.itemId } },
          },
        });
      },
    },
  },
});
