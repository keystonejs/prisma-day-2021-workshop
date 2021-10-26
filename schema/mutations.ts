import { graphQLSchemaExtension } from '@keystone-next/keystone';
import {
  KeystoneContext,
  PollWhereInput,
  PollWhereUniqueInput,
} from '.keystone/types';
//import { isSignedIn } from './access';
import { pure } from '../utils/maybeIOPromise';
import { drop } from '../utils/func';
import { log } from '../utils/logging';
const gql = ([content]: TemplateStringsArray) => content;

const clearVote = (_context: KeystoneContext, pollFilter: PollWhereInput) => {
  return pure(_context)
    .then(c => c.sudo())

    .promise(async context => {
      return context.db.PollAnswer.findMany({
        where: {
          poll: pollFilter,
          answeredByUsers: { some: { id: { equals: context.session.itemId } } },
        },
      }).then(ans => ({
        context: context,
        answers: ans as PollWhereUniqueInput[],
      }));
    })

    .promise(async env => {
      return env.context.db.PollAnswer.updateMany({
        data: env.answers.map(answer => ({
          where: { id: answer.id },
          data: {
            answeredByUsers: { set: [] },
          },
        })),
      }).then(n => drop(n)(env));
    });
};

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
        clearVote(context as KeystoneContext, {
          id: { equals: pollId },
        })
          .run()
          .then(e => drop(e)(true))
          .catch(e => drop(log().error('Caught: ').error(e))(false));
      },
      async voteForPoll(rootVal, { answerId }, context) {
        clearVote(context as KeystoneContext, {
          answers: { some: { id: { equals: answerId } } },
        })
          .promise(e =>
            e.context.db.PollAnswer.updateOne({
              where: { id: answerId },
              data: {
                answeredByUsers: { connect: { id: e.context.session.itemId } },
              },
            })
          )
          .run()
          .then(n => drop(n)(true))
          .catch(e => drop(log().error('Caught: ').error(e))(false));
      },
    },
  },
});
