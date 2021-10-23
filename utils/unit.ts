export const u = {};

export type U = typeof u;

export const cr = '\n';

export const sideEffect =
  // eslint-disable-line no-unused-vars


    <T, SR, R>(side: (mapsIgnored: T) => SR) =>
    (ctn: (mapsIgnored: T) => R) =>
    (env: T): R => {
      side(env);
      return ctn(env);
    };
