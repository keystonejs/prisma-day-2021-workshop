import React from 'react';
// FIXME: there's a cache issue with Urql where it's not reloading the
// current user properly if we do a client-side redirect here.
// router.push('/');

export const gotoPage = (page: string) => {
  if (top) if (top.location) if (top.location.href) top.location.href = page;
};
