// Welcome to wrap_any: The aim is for this file to become empty
// It's the place to admit temporary defeat in eliminating an `any` type,
// and clean the api at a level higher by providing concrete types

// To ensure we only match any once in the top level of this app,
// and give any a descriptive type name
// This is the local alias for the dreaded `type`

type WrappedRampantlyPolymorphic = any;
//Any any is immediately assigned the status RampantlyPolymorphic, which matches exactly what it means
export type RampantlyPolymorphic = WrappedRampantlyPolymorphic;

//Anything that really needs to be fully polymorphic has to earn the right
//Its first status is TestingHardenedAny
export type TestingHardenedAny = WrappedRampantlyPolymorphic;

//Then, once the code has been tested and fully working with undefined input, it can be promoted to
export type HardenedAny = WrappedRampantlyPolymorphic;

//These functions set a puzzle to, TBC ...
// Solved

// These are the problem functions
// The task is to strongly type them. Some require upstream modifications
// Others are just puzzling, and might have a local solution.

// A JSX type?

export type DocumentType = WrappedRampantlyPolymorphic;

// These have taken hours of time to resolve, with no joy, and have found a temporary home here ...
export type ItemType = WrappedRampantlyPolymorphic;
export type ItemSession = WrappedRampantlyPolymorphic;

//From deep down in the keystone types ...
export type GraphQLOutput = Record<string, WrappedRampantlyPolymorphic>;
