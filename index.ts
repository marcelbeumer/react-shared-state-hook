import { useState, useEffect, useRef } from 'react';

export interface Selector<T, P> {
  (state: T): P;
}

export interface IsEqualFn<P> {
  (prev: P, next: P): boolean;
}

export interface SharedStateHook<T> {
  (): T;
  <P>(fn: Selector<T, P>, isEqual?: IsEqualFn<P>): P;
}

export interface SharedStateSetter<T> {
  (newState: T): void;
}

export const createSharedStateHook = <T>(
  initialState: T
): [SharedStateHook<T>, SharedStateSetter<T>] => {
  let state = initialState;
  let handlers: ((state: T) => void)[] = [];

  const hook: SharedStateHook<T> = <P>(selectorFn?: Selector<T, P>, isEqualFn?: IsEqualFn<P>) => {
    const select = selectorFn !== undefined ? selectorFn : (o: T) => o;
    const [selection, setSelection] = useState(() => select(state));
    const selectionRef = useRef(selection);
    const selectorRef = useRef(select);
    const isEqualRef = useRef(isEqualFn);
    selectorRef.current = select; // allow new selector fn on each render
    isEqualRef.current = isEqualFn; // allow new isEqual fn on each render

    useEffect(() => {
      const handler = (newState: T) => {
        const nextSelection = selectorRef.current(newState);
        const currentIsEqualFn = isEqualRef.current;
        const previousSelection = selectionRef.current;
        const isEqual =
          currentIsEqualFn !== undefined
            ? currentIsEqualFn(previousSelection as P, nextSelection as P)
            : previousSelection === nextSelection;
        if (!isEqual) {
          selectionRef.current = nextSelection;
          setSelection(nextSelection);
        }
      };
      handlers.push(handler);
      return () => {
        handlers = handlers.filter(fn => fn !== handler);
      };
    }, []);
    return selection;
  };

  const setter: SharedStateSetter<T> = newState => {
    state = newState;
    handlers.forEach(fn => fn(state));
  };

  return [hook, setter];
};
