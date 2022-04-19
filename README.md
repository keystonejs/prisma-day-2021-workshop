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

![workflow](https://github.com/qfunq/prisma-day-2021-workshop/actions/workflows/latest.yml/badge.svg)



This branch is dedicated to creating a solid foundation for a production build to extend Keystone 6 CMS from.


Currently working on the low code style core, which hates `any` just as much as I do, and spots the tiniest of issues. Industry best practise is a useful side effect of harsh CI tooling.


`yarn commit "message"` fires off the CI pipeline and only commits if unit tests are passed locally. No longer requires yarn dev running without the main next front end, since yarn site:build is the primary unit test. "fastcommit" is considered dangerous, and needs some additional logic to be CI safe. Its been the cause of a few red crosses. For that reason, it is being prefixed by an `x`, so commands in the history buffer do not trigger it.

`yarn push` auto push to origin latest

`yarn commit "message" && yarn push` is what lands up being used most often.

## Production status report

✅ CI: Github actions runner working in a test framework. Unseeded build cases handled (any bugs fixed!)

✅ Pre release: Testing

Full k8s spec: WIP. Deferred because its an endless task.

✅ More informative logging, suitable for deployment.

✅ Logging: Code coverage: complete

✅ Refactored literals.

✅ Authorization: Strong typing for keystone auth frame types

✅ Next build super user authorization to keystone, allowing SSR/SSG/ISR tunneling.

✅ MaybeIOPromise replaces all awaits.

✅ Catches any exceptions transparently and uniquely, at point of execution.
    Runs deferred using a compiled monadic script that can never return a null or undefined value.
    Use case guarantees low stack usage, which allows pure `CCC` code to run without coroutine optimizations.



A shout out to @jed for explaining the keystone way.
Ready for exhaustive testing. Bug reports welcome!



## Resiliance testing, unit testing

✅ A stale session led to the app throwing when voting occured.
Code fixed by a log.warning and return.

✅ Session secret autogenerated using two CUID's at start of AdminUI, leading to stale session rejection
    and enforced return to Admin UI login page when KS server restarted.

✅ Rejigged fetch command because some failure continuations were never been called.
Tested and working.

✅ Await eliminated using monads of promises.

✅ Only throws were in polls and static data fetch. Both have been refactored.

✅ Next builds even when there is no static data, i.e. an empty database. Requires precise handling to return the correct types.

✅ Many issues tracked down using the empty database technique. It triggers every any/null/undefined bug, with a vengeance.
   Strongly recommended as a unit testing technique.

✅ Polyfilled monadic logging parses variable Error() format.
   Localised abbreviated logging grammar for more readable logs.

✅ CI: Lint extend set to ["next/core-web-vitals","eslint:recommended"] ++


✅ The Promise monad has been battle hardened, and is seen as a critical tool
   in the CI process, since the code it produces is even more modular than `ts` alone.

https://www.youtube.com/watch?v=vkcxgagQ4bM

✅ Works out the box in `ts`.

✅ Resolves complications caused by interactions with `async`, `Promise<T>` etc.

✅ `CCC` Implementation of MaybeIOPromise tested and working.

✅ Rolled out to all gql queries, which become much tidier as a result.

## Security audit
Status: `Preliminary`.



✅ No Codiga linting errors, 100% score on all categories. Code inspector has a divide by zero bug that reports N/A when it can find no errors.

<a href="https://app.codiga.io/public/user/github/qfunq">
   <img src="https://api.codiga.io/public/badge/user/github/qfunq?style=light" alt="codiga badge" />
</a>

## TL;DR
`<T>(a: T)` is a type safe replacement for many cases of `(a: any)`, because we need to trap the awkward `undefined` cases at build time.

`Maps<D,R>` (reads: `maps domain to range`) eliminates the dummy variable in some functional type definitions, in a lint friendly way.
This is both more succinct, and more appropriate for usage in point free type descriptions.


## any is shouting: I AM WRITTEN IN JAVASCRIPT ... listen to it, and recode it ASAP

`wrap_any.ts` is an ugly name for an ugly file. It might change names to become even more noticable. Its sole role is wrapping `any` subtypes that can't be deduced for some reason. It has proved to be a very
practical way of localising `any` issues. Give the usage a name, and fixed location, right under the peer review spot light. Have varying degree of `anyness`. Take a look at the file, it's a toxic dump of puzzles and types best avoided, and attempts to handle them at a distance. There are more radical approaches that I'm looking at, but they are alien.

`any` issues:
Low level ts/js security audit: Research and development has established many bugs hide in the rampantly polymorphic `any` type.

This `dangerous construct` is used in upstream auth.

```
Approximately 75% of these situations reveal an unhandled case, hidden from lint.
```

## await is almost as bad as any

Every `await` needs to be wrapped in a `try` `catch` block, or better still, wrapped in a `promise`, which either is already, or extends to a `monad` (since the original implementors of `js Promises` just implemented `fmap/then`, without `bind`, probably because its action is immediate. Oooops.). Fortunately, `await` is less abused than `any`. Once monadic IO replaces it, it's hard to contemplate using anything else, and `await` code is easily lifted to `fmap` or `fbind`. There will still always be some ugly IO bindings, such as with `fetch`, but they have been localized and abstracted.

The conversion to monadic io is complete. No awaits remain.

This is possibly one of the most important details for stability, because Keystone throws exceptions,
possibly originally thrown by apollo, and if those exceptions are not caught, the server goes down.

I used to think google were wrong in not allowing exceptions in their house style, but now it makes complete sense. Exceptions try their best to destroy monadic structure, but fortunately, they can be tamed using the techniques applied in this code.

## eslint is just as harsh. any is a virus that infects code. easy to train it about await too ...

✅ Abstract away the dummy variable in `typescipt` type definitions.
`f: Maps<Domain, Range>`, which is implemented in `func.ts`. It absracts away the old `maps:` notation using a lint violation in a single location, removing a blemish from the `ts` type system. Uniquely declared lint violations are handled using drop, i.e. Curried `false`. Because it's used so often, it's aliased to it's local usage, so as not the swamp the namespace with too many `drop`s.


`<T>(a: T)` is not the same as `(a: any)`. The templated class can't echo undefined types, but `any` can! This is seen as a `very good thing`.

`<T>(a: T)` is a type safe replacement for any, because we need to trap the awkward `undefined` cases at build time. Then the type inferrence become far more similar to `C++`, which works well until it hits recursive types (with the unfortunate side effect of nerfing monads/coroutines).

My mission against `any` is more than fully justified, and I'm not alone:

https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html


There is also a `dodgy C++ style cast`, right where it's not needed ... `TBC`.

The reason monads are important is that `ts` offers us the `CCC` to programme in, (eliminating `any` completely), if we so desire. Then a programme can be proved to do exactly what it says it does.

`ts` appears equally capable of expressing algorithms in the `CMC` or the `CCC`.

There are positive benefits resulting from entanglement in the `CMC`, it can be used to model subscriptions.

## DRY = sole source of truth

... and it sets deep theoretical/practical puzzles, part addressed in this code base. However `typescript` is not ideal for `DRY`, but it suffices. When enhanced with `abstract syntax trees` it bites back that bit more, a critical technique in Keystone core.

## On naming
The Native American naming/language model is used. Functions are verbs, and are named by what they do.

Categorical morphisms are weaker, polymorphic aliases to these concrete names, and are `only to be used in generic code`. If writing specific code, it is recommended to use the specific name.

There nothing worse than greping through 60 pages of `process` matches, all processing something completely different, (a C++ example, but we have all been there, try searching for `: any` in the top of a node project ... ).

`then`, and `catch`, are heavily overused in all languages. IMHO, new apis need to avoid these keywords, but also supply categorical aliases, such as `bind`, `fmap`, `then`,`finally` if generic programming is required.

I'm fairly new to `ts`, and like it a lot, but without a formal style, it can become unmanagable.

With these caveats in mind, enjoy this latest release of @jeds prisma day workshop app, ported to Keystone 26, with useful contrib from @Guatam Singh, and polished endlessly by qfunq (it deserves it, Keystone 6 is the best CMS out there, Next, best in class, the same for prisma, and jeds code pulls it all together in a very useful way), and be fully aware, however solid it seems, this application is still in a `testing` phase.



## Known Issues

UI inforces the 1->0:1 hidden relationship of an element of answeredByUser -> (poll,vote). This is less than perfect,
since postgres contraints spill into the business logic, which shows up in the Admin UI,
where a User can be assigned multiple votes in the same Poll. To fix this is quite complex, since adding views or constraints breaks auto migration. The migrations carry a history of experiments to try to understand this issue. If anyone has a fix for this, please do post it in the issues forum.

## Security Issues

Polling shows up some issues in Keystone:
   The lack of field access:filter severely restricts the ability to secure apis. In many cases
   access:filter is reduced to a fairly trivial role, since fields cannot override it, but it is also the last line of defense for security, so the default should be reject. But this standard
   firewall like state cannot be achieved with the current apis.

`wrap_any.ts:` the place where dark hacks live to get the system building. Its grown
rather than shrank, because `any` is often used to create objects without delegating
a strong typed call to the top level application. `DRY/CCC` is harsh, and forces certain design contraints, which are not often followed. But when they are, everything clicks together perfectly.


## Additional functionality from upstream main

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
      yarn lint: additional, harsher lint checks
   Utils folder for additional code, informative naming.
   MaybeIO/Promise for DRY declarative specification of graphql parsing/error handling
      Resolves many hidden bugs in the original imperative code.
   Additional Poll functionality:
      Users can clear their own votes only
      Unvoted polls don't reveal their results
      Voted poll disables UI for that poll (otherwise bounce can lead to race conditions).
   Front end / Admin UI dectection for selective access:filter, preventing exposure of user names
      and CUIDs to low auth users, and allowing vote counts to be accessed.
   Github repos fully working.


## How to install the latest branch

The definitive install instructions, assuming fedora, bar seeding, are in the workflow file:


Install it like this and you know you will get the latest CI build. ![workflow](https://github.com/qfunq/prisma-day-2021-workshop/actions/workflows/latest.yml/badge.svg)

<a href="https://app.codiga.io/public/user/github/qfunq">
   <img src="https://api.codiga.io/public/badge/user/github/qfunq?style=light" alt="codiga badge" />
</a>


If for some reason, the latest CI build is failing (it happens!), find the last good build. As it stands, the yml specifies a test, not a production framework.

Seeding and post seeding CI unit tests: The harsh test of
building the database unseeded works. This leaves the application agnostic on
how data is seeded, since there are many ways to achieve this.


All testing/patches/security audits are welcome. Feel free to contribute to documenting the industry best practises for using keystone CMS combined with the powerhouse front end nextjs.

## License

Copyright (c) 2021 Thinkmill Labs Pty Ltd. Licensed under the MIT License.

Modifications: Copyright (c) 2021 Fourcube Ltd. Licensed under the MIT License.
