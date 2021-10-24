import { graphQLSchemaExtension } from '@keystone-next/keystone';
import { KeystoneContext, PollWhereUniqueInput } from '.keystone/types';
import { log } from '../utils/logging';

const gql = ([content]: TemplateStringsArray) => content;

async function clearVote(_context: KeystoneContext) {
  const context = _context.sudo();
  if (!context.session) {
    //Removed throw, which was crashing keystone
    log().warning('Stale context: you must be signed in to vote');
    return;
  }

  const answers = await context.db.PollAnswer.findMany({
    where: {
      answeredByUsers: { some: { id: { equals: context.session.itemId } } },
    },
  });

  if (answers.length) {
    await context.db.PollAnswer.updateMany({
      data: answers.map((answer: PollWhereUniqueInput) => ({
        where: { id: answer.id },
        data: {
          answeredByUsers: { set: [] },
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
      async clearVoteForPoll(context) {
        await clearVote(context as KeystoneContext);
      },
      async voteForPoll({ answerId }, _context) {
        const context = _context.sudo() as KeystoneContext;
        clearVote(context);
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
