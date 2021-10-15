import { config } from '@keystone-next/keystone';
import { statelessSessions } from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';

import { lists, extendGraphqlSchema } from './schema';
import { permissions } from './schema/access';

const dbUrl =
  //  `postgres://postgres_user:change_me_in_multiple_places@pg/prisma_day_2021_latest` ||
  `${process.env.DATABASE_URL}` ||
  `postgres://${process.env?.POSTGRES_USER}:${process.env?.POSTGRES_PASSWORD}@${process.env?.POSTGRES_HOST}/${process.env?.POSTGRES_DB}`;

console.log(`Database url: ${dbUrl}`);

const sessionSecret =
  process.env.SESSION_SECERT ||
  'iLqbHhm7qwiBNc8KgL4NQ8tD8fFVhNhNqZ2nRdprgnKNjgJHgvitWx6DPoZJpYHa';

export const keystoneNextjsBuildApiKey =
  process.env.KEYSTONE_NEXTJS_BUILD_API_KEY ||
  'utils.ts:_keystoneNextjsBuildApiKey_says_change_me_!!!!!!!_im_just_for_testing_purposes';

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
    ui: { isAccessAllowed: permissions.canUseAdminUI },
    lists,
    session: statelessSessions({
      secret: sessionSecret,
    }),
    extendGraphqlSchema,
  })
);
