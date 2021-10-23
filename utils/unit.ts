import { Maps } from './func';

export const u = {} as const;

export type U = typeof u;

export const cr = '\n';

export const sideEffect =
  <T, SR, R>(side: Maps<T, SR>) =>
  (ctn: Maps<T, R>) =>
  (env: T): R => {
    side(env);
    return ctn(env);
  };
