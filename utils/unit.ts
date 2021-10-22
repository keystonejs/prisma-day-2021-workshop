export const u = {};

export type U = typeof u;

export const cr = '\n';

export const sideEffect =
  <T, SR, R>(side: (maps: T) => SR) =>
  (ctn: (maps: T) => R) =>
  (env: T): R => {
    side(env);
    return ctn(env);
  };
