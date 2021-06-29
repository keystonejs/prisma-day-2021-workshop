import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import {
  KeystoneListsAPI,
  KeystoneDbAPI,
  KeystoneContext,
} from '@keystone-next/types';
import { KeystoneListsTypeInfo } from '.keystone/types';

const gql = ([content]: TemplateStringsArray) => content;

type Context = Omit<KeystoneContext, 'db' | 'lists'> & {
  db: { lists: KeystoneDbAPI<KeystoneListsTypeInfo> };
  lists: KeystoneListsAPI<KeystoneListsTypeInfo>;
};

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: gql`
    type Mutation {
      voteForPoll(answerId: ID!): Boolean
    }
  `,
  resolvers: {
    Mutation: {
      async voteForPoll(rootVal, { answerId }, _context) {
        const context = _context.sudo() as Context;
        if (!context.session) {
          return false;
        }

        const answers = await context.lists.PollAnswer.count({
          where: {
            poll: { answers_some: { id: answerId } },
            answeredByUsers_some: { id: context.session.itemId },
          },
        });
        if (answers > 0) {
          return false;
        }
        await context.lists.PollAnswer.updateOne({
          id: answerId,
          data: {
            answeredByUsers: { connect: { id: context.session.itemId } },
          },
        });
        return true;
      },
    },
  },
});
