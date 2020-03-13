import React from 'react';
import test from 'tropic';
import assert from 'assert';
import { render } from '@testing-library/react';
import { createSharedStateHook } from '..';

const { deepStrictEqual: eq } = assert;

const createBefore = (initialState: any) => {
  const [useSharedState, setSharedState] = createSharedStateHook(initialState);

  const BasicComponent = () => {
    const state = useSharedState();
    return (
      <div className="basic">
        {state.a} + {state.b}
      </div>
    );
  };

  return {
    BasicComponent,
    setSharedState
  };
};

test('setSharedState updates local state ref', () => {
  const initalState = { a: 1, b: 2 };
  const { BasicComponent, setSharedState } = createBefore(initalState);
  const { container } = render(<BasicComponent />);
  eq(container.querySelector('.basic')?.innerHTML, '1 + 2');
  setSharedState({ a: 1, b: 3 });
  eq(container.querySelector('.basic')?.innerHTML, '1 + 3');
});
