export function createResolvablePromise<T = any>() {
  let resolve: (value: T) => void, reject: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve: resolve!,
    reject: reject!,
  };
}

export function isPromise(value: any) {
  return (
    value instanceof Promise ||
    (value &&
      typeof value === 'object' &&
      'then' in value &&
      typeof value.then === 'function')
  );
}

export function isAsyncGenerator(value: any) {
  return value && typeof value === 'object' && Symbol.asyncIterator in value;
}

export function isSymbolIterator(value: any) {
  return value && typeof value === 'object' && Symbol.iterator in value;
}
