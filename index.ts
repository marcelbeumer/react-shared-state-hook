import { useState, useEffect, useCallback, useRef } from 'react';

export interface Selector<T, P> {
  (state: T): P;
}

export interface SharedStateHook<T> {
  (): T;
  <P>(fn?: Selector<T, P>): P;
}

export interface SharedStateSetter<T> {
  (newState: T): void;
}

export const createSharedStateHook = <T>(
  initialState: T
): [SharedStateHook<T>, SharedStateSetter<T>] => {
  let state = initialState;
  let handlers: ((state: T) => void)[] = [];

  const hook: SharedStateHook<T> = <P>(selectorFn?: Selector<T, P>) => {
    const select = selectorFn !== undefined ? selectorFn : (o: T) => o;
    const [selection, setSelection] = useState(() => select(state));
    const selectionRef = useRef(selection);
    const handler = useCallback((newState: T) => {
      const newSelection = select(newState);
      // Workaround for what seems to be a React bug:
      // When changing state for component A, components B+ will
      // also re-render even though their state did not change.
      // When changing component A again behavior is normal again.
      if (selectionRef.current !== newSelection) {
        selectionRef.current = newSelection;
        setSelection(newSelection);
      }
    }, []);
    useEffect(() => {
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
