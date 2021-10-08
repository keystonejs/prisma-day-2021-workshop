import { config } from '@keystone-next/keystone';
import { statelessSessions } from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';
import { lists, extendGraphqlSchema  } from './schema';
import { rules } from './schema/access';

const dbUrl =
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/keyn_25_0_3`;

const sessionSecret =
  process.env.SESSION_SECRET ||
  'iLqbHhm7qwihbsdfjvb87876sdfIUSHSJZ2nRdprgnKNjgJHgvitWx6DPoZJpYHa';



let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days



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
      maxAge: sessionMaxAge,
      secret: sessionSecret,
    }),
    extendGraphqlSchema,
  })
);

