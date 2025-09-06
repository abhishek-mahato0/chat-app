/* eslint-disable @typescript-eslint/no-explicit-any */
// debounce.ts
type Procedure = (...args: any[]) => void;

export function debounce<F extends Procedure>(func: F, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  } as F;
}
