import React, { useState } from 'react';
import test from 'tropic';
import assert from 'assert';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createSharedStateHook } from '..';

Enzyme.configure({ adapter: new Adapter() });

const { deepStrictEqual: eq } = assert;
const { shallow } = Enzyme;

const createBefore = (initialState: any) => {
  const [useSharedState, setSharedState] = createSharedStateHook(initialState);

  const BasicComponent = () => {
    const state = useSharedState();
    return (
      <div className="basic">
        {state.a} + {state.b}
      </div>
    );
  }

  return {
    BasicComponent,
    setSharedState,
  }
}

test('setSharedState updates local state ref', () => {
  const initalState = { a: 1, b: 2 };
  const { BasicComponent, setSharedState } = createBefore(initalState);
  const wrapper = shallow(<BasicComponent />);
  eq(wrapper.find('.basic').text(), '1 + 2');
  setSharedState({ a: 1, b: 3 })
  wrapper.setProps({})
  eq(wrapper.find('.basic').text(), '3 + 4');
});
