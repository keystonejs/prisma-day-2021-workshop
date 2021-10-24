import { graphQLSchemaExtension } from '@keystone-next/keystone';
import {
  KeystoneContext,
  PollWhereInput,
  PollWhereUniqueInput,
} from '.keystone/types';
import { log } from '../utils/logging';
import { isSignedIn } from './access';
const gql = ([content]: TemplateStringsArray) => content;

async function clearVote(
  _context: KeystoneContext,
  pollFilter: PollWhereInput
) {
  const context = _context.sudo();

  const answers = await context.db.PollAnswer.findMany({
    where: {
      poll: pollFilter,
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
      async clearVoteForPoll(rootVal, { pollId }, context) {
        if (!isSignedIn(context as KeystoneContext)) return;
        log().info('pollId').info(pollId);
        await clearVote(context as KeystoneContext, { id: { equals: pollId } });
      },
      async voteForPoll(rootVal, { answerId }, _context) {
        const context = _context.sudo() as KeystoneContext;
        if (!isSignedIn(context)) return;

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
