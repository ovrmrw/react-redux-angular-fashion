import { createStore, Reducer, combineReducers } from 'redux';

export interface AppState {
  counter: number;
  asyncCounter: number;
}

const incrementReducer: Reducer<number> = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

const asyncIncrementReducer: Reducer<number> = (state = 0, action) => {
  switch (action.type) {
    case 'ASYNC_INCREMENT':
      return state + 1;
    case 'ASYNC_DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

export const reducers = combineReducers<AppState>({
  counter: incrementReducer,
  asyncCounter: asyncIncrementReducer
});
