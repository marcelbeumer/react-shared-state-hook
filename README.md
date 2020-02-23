# WIP: NOT PUBLISHED YET

# react-shared-state-hook [![Build status](https://travis-ci.org/marcelbeumer/react-shared-state-hook.svg?branch=master)](https://travis-ci.org/marcelbeumer/react-shared-state-hook)

Simple React shared state hook based on useState

- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Example application setup](#example-application-setup)

## Installation

```
npm i react-shared-state-hook
```

## Basic usage

```tsx
import React from 'react';
import { createSharedStateHook } from 'react-shared-state-hook';

const [useSharedState, setSharedState] = createSharedStateHook({ a: 1, b: 2 });
// setSharedState({ a: 1, b: 3 }); // update state and trigger re-render

const ComponentA = () => {
  const state = useSharedState(); // re-render on any change
  return (
    <div>
      {state.a} + {state.b}
    </div>
  );
};

const ComponentB = () => {
  const b = useSharedState(o => o.b); // only re-render when b changes
  return <div>{b}</div>;
};
```

## Example application setup

```ts
// index.ts
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

ReactDOM.render(React.createElement(App), document.getElementById('root'));
```

```tsx
// App.tsx
import React from 'react';
import { useActions, useAppState } from './state';

export const App = () => (
  <>
    <UsernameControl />
    <CountControl />
  </>
);

const UsernameControl = () => {
  const username = useAppState(o => o.username);
  const actions = useActions();
  return (
    <div>
      <p>Hello {username || '...'}</p>
      <input value={username ?? ''} onChange={e => actions.setUsername(e.target.value)} />
    </div>
  );
};

const CountControl = () => {
  const count = useAppState(o => o.count);
  const actions = useActions();
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => actions.increaseCount()}>+1</button>
    </div>
  );
};
```

```ts
// state.ts
import { createSharedStateHook } from 'react-shared-state-hook';
import * as actions from './actions';

export interface AppState {
  username: string | null;
  count: number;
}

let appState: AppState = {
  username: null,
  count: 1,
};

const [useAppStateHook, setAppState] = createSharedStateHook(appState);
const [useActionsHook] = createSharedStateHook(actions);

export const useAppState = useAppStateHook;
export const useActions = useActionsHook;

export const getState = () => appState;
export const setState = (update: Partial<AppState>) => {
  const newState: AppState = { ...appState, ...update };
  appState = newState;
  setAppState(appState);
};
```

```ts
// actions.ts
import { setState, getState } from './state';

export function setUsername(username: string) {
  setState({ username });
}

export function increaseCount() {
  setState({ count: getState().count + 1 });
}
```
