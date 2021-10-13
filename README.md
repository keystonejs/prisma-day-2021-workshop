# Prisma Day 2021 Workshop

This is the sample app built for Jed's Prisma Day 2021 Workshop.

It's both the front and back-end for a Blog built with Prisma, KeystoneJS, GraphQL, Next.js and Tailwind.

The App includes public auth and signup, role-based access control, and custom design-system based components in the Content field. Content authors can embed Polls in post content, and authenticated visitors can vote on responses.

## About KeystoneJS

**Keystone 6** is the next-gen CMS for Node.js built with Prisma, Apollo Server, and Next.js.

Fully open source, it's not just a great headless CMS, it's also a powerful API server and app back-end.

Learn more at [keystonejs.com](https://keystonejs.com)

## Running this app

Make sure you have:

- Node v12 or v14
- Yarn
- Postgres

Then, clone this repo and run `yarn` to install the dependencies.

### Starting the API

Start the API Server first by running `yarn api:dev`. This will start Keystone's GraphQL API and Admin UI on `localhost:3000`

The first time you open that link you will be prompted to create a new user.

### Starting the Site

With the API running, in a separate terminal run `yarn site:dev`. This will start the front-end Next.js app on `localhost:8000`

## About the codebase

The Keystone and Next.js app are colocated in the same repo for ease of demonstration, but you'd often separate them into different packages in a monorepo or even separate repositories.

The back-end files include:

```
keystone.ts
schema.graphql (generated)
schema.prisma (generated)
schema.ts
schema/*
```

The front-end files include:

```
components/*
pages/*
next-env.d.ts
next.config.js
postcss.config.js
tailwind.config.js
utils.js
```



## About the latest branch:

This branch is dedicated to creating a solid foundation for a production build to extend keystone CMS from.

CI: Github actions in testing. Unseeded build.
```
yarn commit "message" ... adds files and commits.
yarn push ... (auto push to origin latest)
```
Known Issues:

Authorization: WIP. Strong typing keystone frame types.

Test code in access has to find a new home.

Refactor literals.

How to code where: true/false in gql without touching keystone core code. 

Extend WhereInput to be WhereInput | true | false ... is yet to be tested as a patch to core. Can this work as a local patch? To be investigated ...

Production build status: 
```
Deductive filtering correctly identifies browswer based localhost traffic in testing. 

Next build super user authorization to keystone, allowing for SSR/SSG/ISR tunneling.
   USE CASE: TESTING BUILD FUNCTIONALITY ONLY. 

Api key connected to workflow. Injected into provably correct location, in utils.ts.

Pre production testing release status: 
   Admin UI Authorization has passed preliminary testing. 
   DRY permissions. Rules deprecation. Some tidying up stil to be done.
   Ready for exhaustive testing.

The current implementation of build process api's is a hack. A shout out to Jed for explaining the keystone way. WIP.
It has passed only the most preliminary of security tests, determining localhost web from build, i.e. a proof of concept.

Additional KeystoneContext auth information and a shared API key, set in via process .env: 
   needs to be correctly handed down in the headers to the last line of defense, access: filter.

```

Additional functionality from upstream main:
```
Polls fully working.
Production build:
   next lint
   tailwind purge
   telemetry disable
   CI scripts: WIP
      Prettier applied in gitadd.
```

## How to install the latest branch

The definitive install instructions, assuming fedora, bar seeding, are in the workflow file:

   https://github.com/qfunq/prisma-day-2021-workshop/blob/latest/.github/workflows/latest.yml

Install it like this and you know you will get the latest CI build.

Seeding and post seeding CI unit tests: WIP. This is a high priority if anyone wants to take it on.
I have some scripts that can boot the process, but they are bash/pqsql, not quite the keystone way, but they are tried, tested, lightweight and effective.


All testing/patches/security audits are welcome. Feel free to contribute to documenting the industry best practises for using keystone CMS combined with the powerhouse front end nextjs.

## License

Copyright (c) 2021 Thinkmill Labs Pty Ltd. Licensed under the MIT License.

Modifications: Copyright (c) 2021 Fourcube Ltd. Licensed under the MIT License.
