// https://github.com/willybrauner/signal-playground

type Sub<T> = (s: T) => void;

type ComputeContext = {
  setDirty: () => void;
  addSource: (cleanup: () => void) => void;
};

// global stack to track current computed/effect being evaluated
const STACK: Array<ComputeContext> = [];

/**
 * signal
 */
export const signal = <T>(
  initial: T,
): {
  value: T;
  suscribe: (fn: Sub<T>) => () => void;
} => {
  let value: T = initial;
  const subs = new Set<Sub<T>>();

  return {
    // if there is a computed being evaluated
    // register it as a subscriber
    // return the current value
    get value(): T {
      const currentComputed = STACK[STACK.length - 1];
      if (currentComputed) {
        subs.add(currentComputed.setDirty);
        currentComputed.addSource(() => {
          subs.delete(currentComputed.setDirty);
        });
      }
      return value;
    },
    // only notify subscribers if value changed
    set value(v: T) {
      if (value === v) return;
      value = v;
      for (const fn of Array.from(subs)) fn(v);
    },
    // Add the subscriber
    // return the cleanup function
    suscribe(fn: Sub<T>) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
};

/**
 * computed
 */
export const computed = <T>(fn: () => T) => {
  const subs = new Set<ComputeContext>();

  // Value cached from the last compute
  let cachedValue: T;
  // Track cleanup functions from sources
  let sources: Set<() => void> = new Set();
  let dirty = true;

  // function to compute and cache the value
  const _internalCompute = (): void => {
    // Clean, remove compute from all old subs
    sources.forEach((cleanup) => cleanup());
    sources.clear();
    // push current compute onto stack
    // flag dirty instead of calling compute (lazily evaluated)
    STACK.push({
      setDirty: () => {
        if (dirty) return;
        dirty = true;
        for (const sub of Array.from(subs)) sub.setDirty();
      },
      addSource: (unsubscribe) => sources.add(unsubscribe),
    });
    // call the function to compute the value
    cachedValue = fn();
    // set as not dirty
    dirty = false;
    // restore previous computed
    STACK.pop();
  };

  return {
    get value() {
      const currentComputed = STACK[STACK.length - 1];
      if (currentComputed) {
        subs.add(currentComputed);
        currentComputed.addSource(() => {
          subs.delete(currentComputed);
        });
      }
      // Recompute if dirty
      if (dirty) _internalCompute();

      return cachedValue;
    },
  };
};

/**
 * Effect
 */
export const effect = (fn: () => void) => {
  let sources: Set<() => void> = new Set();

  const _internalCompute = () => {
    // Clean up old subscriptions
    sources.forEach((cleanup) => cleanup());
    sources.clear();
    // Push current effect onto stack
    STACK.push({
      setDirty: _internalCompute,
      addSource: (cleanup) => sources.add(cleanup),
    });
    // Run the effect function
    fn();
    // Remove current effect informations from stack
    STACK.pop();
  };

  // Initial run
  _internalCompute();

  // Return cleanup function
  return () => {
    sources.forEach((cleanup) => cleanup());
    sources.clear();
  };
};
