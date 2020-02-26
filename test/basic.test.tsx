import React from 'react';
import test from 'tropic';
import assert from 'assert';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createSharedStateHook } from '..';

Enzyme.configure({ adapter: new Adapter() });

const { deepStrictEqual: eq } = assert;
const { mount } = Enzyme;

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
  const wrapper = mount(<BasicComponent />);
  eq(wrapper.find('.basic').text(), '1 + 2');
  setSharedState({ a: 1, b: 3 });
  eq(wrapper.find('.basic').text(), '1 + 3');
});
