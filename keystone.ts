import { log } from './utils/logging';
import { config } from '@keystone-next/keystone';
import { statelessSessions } from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';

import { lists, extendGraphqlSchema } from './schema';
import { permissions } from './schema/access';
import { MaybeInputTests } from './utils/recursive_const';

const dbUrl =
  `${process.env.DATABASE_URL}` ||
  `postgres://${process.env?.POSTGRES_USER}:${process.env?.POSTGRES_PASSWORD}@${process.env?.POSTGRES_HOST}/${process.env?.POSTGRES_DB}`;

export const keyStoneHost = process.env?.KEYSTONE_HOST || 'localhost';

const sessionSecret =
  process.env.SESSION_SECERT ||
  'iLqbHhm7qwiBNc8KgL4NQ8tD8fFVhNhNqZ2nRdprgnKNjgJHgvitWx6DPoZJpYHa';

export const keystoneNextjsBuildApiKey =
  process.env.KEYSTONE_NEXTJS_BUILD_API_KEY ||
  'keystone.ts:_NextjsBuildApiKey_says_change_me_!!!!!!!_im_just_for_testing_purposes';

// Unless I'm missing something, its tricky to clone typescript objects
// Fortunately theres a workaround for monad like objects, create a new one
// using a class factory, in this case, logclos.
// The resulting object is non-clonable, without entanglement, so is in the CMC, and not the CCC.
// Since objects are so hard to clone it ts, this is not a big issue, indeed, ts seems better suited to the CMC

MaybeInputTests();

log()
  .info(`Database url: ${dbUrl}`)
  .success(dbUrl)
  .info(`Keystone host`)
  .success(keyStoneHost);

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
