export const testShallowCopy = <T>(obj: T): T => {
  var copy: any;

  // Handle non object
  if (undefined === obj || null === obj || 'object' != typeof obj) return obj;

  for (var attr in obj) {
    copy[attr] = obj[attr];
  }
  return copy as T;
};

export const shallowCopy = <T>(obj: T): T => obj;
