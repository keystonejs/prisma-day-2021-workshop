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

CI: Github actions runner timed out. Local CI fully functional. Unseeded build.

`yarn commit "message"` fires of CI pipeline and only commits if unit tests passed. Requires yarn dev running without the main next front end, since yarn site:build is the primary unit test.

`yarn push` auto push to origin latest

`yarn commit "message" && yarn push` is what lands up being used.

## Production status report
✅ Pre release: Testing

✅ More informative logging, suitable for deployment.
`✅ Logging: Code coverage: complete`

✅ Refactored literals.
✅ Authorization: Strong typing for keystone auth frame types 
✅ Next build super user authorization to keystone, allowing SSR/SSG/ISR tunneling.
   A shout out to Jed for explaining the keystone way.

Ready for exhaustive testing. Bug reports welcome!
```


## Resiliance testing

✅ A stale session led to the app throwing when voting occured. Code fixed by a log.warning and return.  

✅ Rejigged fetch command because some failure continuations were never been called. Tested and working.
    Yields a clean model for managing the fetch continuations.

✅ Only throws were in polls and static data fetch. Both have been refactored.


## Security audit
Status: `Preliminary`.

## TL;DR
`<T>(a: T)` is a type safe replacement for `(a: any)`, because we need to trap the awkward `undefined` cases at build time. 

wrap_any.ts has the sole role of wrapping types that cant be deduced for some reason. It has proved to be a very
practical way of localising `any` issues.


`any` issues:
Low level ts/js security audit: Research and development has established many bugs hide in the rampantly polymorphic `any` type. 

This `dangerous construct` is used in upstream auth. Roughly 

```
50% of these situations reveals an unhandled case, hidden from lint. 
```

Currently developing a reader friendly notation for the rather awkward ts functional notation, to try to find ways to eliminte `any`. The most readable so far appears to be:

`export const fcompose = <A,B,C>(a: (maps: B) => A) => (b: (maps: C) => B) => (c: C) => 
   a(b(c))`

and in second place,

`export const fcompose = <A,B,C>(a: (X: B) => A) => (b: (maps: C) => B) => (c: C) => 
   a(b(c))`

and for cartestian products:

   `transferFun: (maps: T) => (cross: T) => T`

obviously we would rather write:

   `transferFun: T => T => T,`

but its a bit odd to, at least the ts reads a bit like the intended,

   `transferFun: maps T cross T to T,` 

just all the brackets are in the wrong place for the eye to flow smoothly over it, and the one place we want a new dummy variable, `to`, `ts` forces `=>`. I'd prefer the Haskell style notation to read

   `transferFun: T => T to T,`

since `=>` is somewhat overused. The return type is special in comparisson to intermediary closure parameters.

But when printed, the shorter 
   `transferFun: (maps: T) => (X: T) => T,`

doesn't seem to read as well as
   `transferFun: (maps: T) => (cross: T) => T`

The issue here is we have to name variables for types which are `not instantiated`, and `naming things is hard`. 



Using this convention, a free grammar is pinned down, in which the two new constructs make sense, and the rather clunky type specifications almost become readable, a bit like what tailwind does to css. `cross:` is preferred for short defintions, opposed to `x:` or `X:`. At first these both looked excellent options, then they didn't. `x` is heavily overused. So of the two `X` looks better, but is in caps, so I vote it runner up, but perhaps optimal for long type definitions. `X` in maths means roughly the same thing, as does `cross`, but `cross` is far less likely to be mistaken for a real variable. This is subtle because we are talking about a morphism between the Cartesian product embedded in the closure algebra, and a perhaps a different model of the product i.e. `(a,b)`, or a purely functional list api.

Also cross will match fewer searches when greping though code.


When reviewing code, it can be hard to tell these dummy parameter names from important ones. That's the real point of this comment.

`<T>(a: T)` is not the same as `(a: any)`. The templated class can't echo undefined types, but `any` can! This is seen as a `very good thing`.

`<T>(a: T)` is a type safe replacement for any, because we need to trap the awkward `undefined` cases at build time. Then the type inferrence become far more similar to `C++`, which works well until it hits recursive types (with the unfortunate side effect of nerfing monads/coroutines). 


Another point is that as soon as `any` is used, the code becomes ... javascript. No more needs to be said. My mission against `any` is more than fully justified, and I'm not alone:

https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html

However, some functional code doesn't seem to work properly without the total polymorphism `any` allows, and some ts functional code looks fine, ... but bizarrely doesn't work in all contexts. It might have to do with the inner depths of js module linkage. The places audits have to go ...

There is also a `dodgy C++ style cast`, right where it's not needed ... `TBC`.



With these caveats in mind, enjoy, and be fully aware this release is in a `testing` phase. 




```
Known Issues:


Code can siliently fail in a ?. chain. 
The ?. construction is convenient, but not suitable for production logging, error trapping.
To be replaced with a maybe sytle monad.

How to code where: true/false in gql without touching keystone core code. 

Extend WhereInput to be WhereInput | true | false ... is yet to be tested as a patch to core. Can this work as a local patch? To be investigated ...

```



Additional functionality from upstream main:
```
Polls fully working.
Production build:
   Detailed logging: WIP
   next lint
   tailwind purge
   telemetry disable
   x-api-key for next build events
   CI scripts: WIP: Seeding
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
