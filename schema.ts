import { createSchema } from '@keystone-next/keystone';

import { Poll, PollAnswer } from './schema/polls';
import { User, Role } from './schema/users';
import { Post, Label } from './schema/content';
export { extendGraphqlSchema } from './schema/mutations';

export const lists = createSchema({
  Post,
  Label,
  Poll,
  PollAnswer,
  User,
  Role,
});
