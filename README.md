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



## About the latest branch: ![workflow](https://github.com/qfunq/prisma-day-2021-workshop/actions/workflows/latest.yml/badge.svg)

This branch is dedicated to creating a solid foundation for a production build to extend Keystone 6 CMS from.

`yarn commit "message"` fires off the CI pipeline and only commits if unit tests are passed locally. No longer requires yarn dev running without the main next front end, since yarn site:build is the primary unit test. "fastcommit" is considered dangerous, and needs some additional logic to be CI safe. Its been the cause of a few red crosses. For that reason, it is being prefixed by an `x`, so commands in the history buffer do not trigger it. 

`yarn push` auto push to origin latest

`yarn commit "message" && yarn push` is what lands up being used most often.

## Production status report
```
✅ CI: Github actions runner working in a test framework. Unseeded build cases handled (any bugs fixed!)
✅ Pre release: Testing

Full k8s spec: WIP. Deferred because its an endless task.

✅ More informative logging, suitable for deployment.
✅ Logging: Code coverage: complete

✅ Refactored literals.
✅ Authorization: Strong typing for keystone auth frame types 
✅ Next build super user authorization to keystone, allowing SSR/SSG/ISR tunneling.

```
A shout out to @jed for explaining the keystone way.
Ready for exhaustive testing. Bug reports welcome!



## Resiliance testing, unit testing

✅ A stale session led to the app throwing when voting occured. 
Code fixed by a log.warning and return.  

✅ Rejigged fetch command because some failure continuations were never been called. 
Tested and working.

✅ Only throws were in polls and static data fetch. Both have been refactored.

✅ Next builds even when there is no static data, i.e. an empty database. Requires precise
handling of `any`.

✅ Any issues tracked down using the empty database technique. It triggers every any bug, with a vengeance.
   Strongly recommended as a unit testing technique.

✅ Polyfilled monadic logging parses variable Error() format. 
   Localised abbreviated logging grammar for more readable logs. 

## Security audit
Status: `Preliminary`.

## TL;DR
`<T>(a: T)` is a type safe replacement for many cases of `(a: any)`, because we need to trap the awkward `undefined` cases at build time. 


## any is shouting: I AM WRITTEN IN JAVASCRIPT ... listen to it, and recode it ASAP

`wrap_any.ts` is an ugly name for an ugly file. It might change names to become even more noticable. Its sole role is wrapping `any` subtypes that can't be deduced for some reason. It has proved to be a very
practical way of localising `any` issues. Give the usage a name, and fixed location, right under the peer review spot light. Have varying degree of `anyness`. Take a look at the file, it's a toxic dump of puzzles and types best avoided, and attempts to handle them at a distance. There are more radical approaches that I'm looking at, but they are alien.

`any` issues:
Low level ts/js security audit: Research and development has established many bugs hide in the rampantly polymorphic `any` type. 

This `dangerous construct` is used in upstream auth. 

```
Approximately 75% of these situations reveal an unhandled case, hidden from lint. 
```

Currently developing a reader friendly notation for the rather awkward `ts functional notation`, to try to find ways to eliminte `any`, in all bar recursive types (which are labelled as such, by an `any` subtype). The most readable so far appears to be:

`export const fcompose = <A,B,C>(a: (maps: B) => A) => (b: (maps: C) => B) => (c: C) => 
   a(b(c))`

and in second place,

`export const fcompose = <A,B,C>(a: (X: B) => A) => (b: (X: C) => B) => (c: C) => 
   a(b(c))`

For cartestian products:

   `transferFun: (maps: T) => (cross: T) => T`

we would rather write:

   `transferFun: T => T => T,`

but its a bit odd too, at least the ts reads a bit like the intended,

   `transferFun: maps T cross T to T,` 

just all the brackets are in the wrong place for the eye to flow smoothly over it, and the one place we want a new dummy variable, `to`, `ts` forces `=>`. I'd prefer the Haskell style notation to read

   `transferFun: T => T to T,`

since `=>` is somewhat overused. Also, the return type is special in comparisson to intermediary closure parameters.

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

The reason this is important is that `ts` offers us the `CCC` to programme in, (eliminating `any` completely), if we so desire. Then a programme can be proved to do exactly what it says it does, and this painfully pedantic style is fully justified.

Research has demonstrated `ts` has issues expressing the `CCC`, but has fewer issues expressing the `CMC`, i.e. quantum categories. This is a slight
surprise, but now known, the `CMC` is used exculsively. This means all transformations of objects are monadic. This is because 
`ts` is call by reference, and objects cant be cloned easily, instead they are `entangled` when referred to twice. So its best to
accept this, and make new objects using a class factory, to be modified by a monad (that that the object is trapped inside of), which cannot be cloned either. This is an efficient way to code closures, because passing the object pointer ensures only a minimum of copying environment is performed, at creation time.

There are also positive benefits resulting from entanglement in the `CMC`, it can be used to model subscriptions.



## On naming
The Native American naming/language model is used. Functions are verbs, and are named by what they do. 

Categorical morphisms are weaker, polymorphic aliases to these concrete names, and are `only to be used in generic code`. If writing specific code, it is recommended to use the specific name. 

There nothing worse than greping through 60 pages of `process` matches, all processing something completely different, (a C++ example, but we have all been there, try searching for `: any` in the top of a node project ... ). 

`then`, and `catch`, are heavily overused in all languages. IMHO, new apis need to avoid these keywords, but also supply categorical aliases, such as `bind`, `fmap`, `then`,`finally` if generic programming is required.

I'm fairly new to `ts`, and like it a lot, but without a formal style, it can become unmanagable.

With these caveats in mind, enjoy this latest release of @jeds prisma day workshop app, ported to Keystone 26, with useful contrib from @Guatam Singh, and polished endlessly by qfunq (it deserves it, Keystone 6 is the best CMS out there, Next, best in class, the same for prisma, and jeds code pulls it all together in a very useful way), and be fully aware, however solid it seems, this application is still in a `testing` phase.






##Known Issues

Code can siliently fail in a ?. chain. Status: WIP.
The ?. construction is convenient, but not suitable for production logging, error trapping.
To be replaced with a maybe sytle monad. 

The Promise monad is a bit of a mess. The more general, recursive approach, without an explicit array, is outlined in `C++`:

https://www.youtube.com/watch?v=vkcxgagQ4bM

and almost works out the box in `ts`. Currently investigating complications caused by interactions with `async`, `Promise<T>` etc. Getting a version of Bartosz's elegant code working under `ts` does look doable, but its also likely to run into subtle type issues. The lack of Haskell type matching makes providing a coroutine/Haskell sytle do notation to `ts` very fiddly. This is Bartosz's main point, imho. If you can't interpret recursively typed monadic code in terms of mutually recursive coroutines, your functional language will be limited (like the `C++` std library is). However, it is sufficient for non-recursive chains, and many use cases are.


How to code where: `true/false` in `gql` without touching keystone core code. 

Extend type `WhereInput` to be `WhereInput` | `true` | `false` ... is yet to be tested as a patch to core. Can this work as a local patch? To be investigated ...






Additional functionality from upstream main:

Polls fully working.
Production build:
   Detailed logging: Date time and polyfilled stack parsing.
   next lint
   tailwind purge
   telemetry disable: interferes with logging.
   x-api-key for next build events
   CI scripts:
      Local CI, then remote CI if and only if local CI succeeds.
      Unseeded corner case working in a test k8s framework. 
      Seeding: Agnostic: there are multiple routes.
      Prettier applied in gitadd.
   Utils folder for additional code, informative naming.


## How to install the latest branch

The definitive install instructions, assuming fedora, bar seeding, are in the workflow file:

   https://github.com/qfunq/prisma-day-2021-workshop/blob/latest/.github/workflows/latest.yml

Install it like this and you know you will get the latest CI build. ![workflow](https://github.com/qfunq/prisma-day-2021-workshop/actions/workflows/latest.yml/badge.svg)

If for some reason, the latest CI build is failing (it happens!), find the last good build. As it stands, the yml specifies a test, not a production framework.

Seeding and post seeding CI unit tests: The harsh test of
building the database unseeded works. This leaves the application agnostic on
how data is seeded, since there are many ways to achieve this.


All testing/patches/security audits are welcome. Feel free to contribute to documenting the industry best practises for using keystone CMS combined with the powerhouse front end nextjs.

## License

Copyright (c) 2021 Thinkmill Labs Pty Ltd. Licensed under the MIT License.

Modifications: Copyright (c) 2021 Fourcube Ltd. Licensed under the MIT License.
