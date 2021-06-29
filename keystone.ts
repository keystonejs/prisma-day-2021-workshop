import { config } from '@keystone-next/keystone/schema';
import { statelessSessions } from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';

import { lists } from './schema';

const dbUrl =
  process.env.DATABASE_URL ||
  `postgres://${process.env.USER}@localhost/prisma-day-workshop-1`;

const sessionSecret =
  process.env.SESSION_SECERT ||
  'iLqbHhm7qwiBNc8KgL4NQ8tD8fFVhNhNqZ2nRdprgnKNjgJHgvitWx6DPoZJpYHa';

const auth = createAuth({
  identityField: 'email',
  secretField: 'password',
  listKey: 'User',
  sessionData: 'id name isAdmin',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    itemData: { isAdmin: true },
  },
});

export default auth.withAuth(
  config({
    db: {
      url: dbUrl,
      provider: 'postgresql',
      // useMigrations: true,
    },
    ui: { isAccessAllowed: ({ session }) => !!session?.data?.isAdmin },
    lists,
    session: statelessSessions({
      secret: sessionSecret,
    }),
  })
);
