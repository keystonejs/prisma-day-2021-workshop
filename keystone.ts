import { config } from '@keystone-next/keystone';
import { statelessSessions } from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';

import { lists, extendGraphqlSchema } from './schema';
import { rules } from './schema/access';

const dbUrl =
  process.env.DATABASE_URL ||
  `postgres://${process.env.USER}@localhost/prisma-day-workshop`;

const sessionSecret =
  process.env.SESSION_SECERT ||
  'iLqbHhm7qwiBNc8KgL4NQ8tD8fFVhNhNqZ2nRdprgnKNjgJHgvitWx6DPoZJpYHa';

const auth = createAuth({
  identityField: 'email',
  secretField: 'password',
  listKey: 'User',
  sessionData: `id name role {
    canManageContent
    canManageUsers
  }`,
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    itemData: {
      role: {
        create: {
          name: 'Super User',
          canManageContent: true,
          canManageUsers: true,
        },
      },
    },
  },
});

export default auth.withAuth(
  config({
    db: {
      url: dbUrl,
      provider: 'postgresql',
      useMigrations: true,
    },
    ui: { isAccessAllowed: rules.canUseAdminUI },
    lists,
    session: statelessSessions({
      secret: sessionSecret,
    }),
    extendGraphqlSchema,
  })
);
