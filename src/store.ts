import { createStore, Action, Reducer, Store as ReduxStore, Unsubscribe } from 'redux';

export class Store<T> {
  private readonly _store: ReduxStore<T>;
  private actionLog: Action[] = [];

  constructor(combinedReducers: Reducer<T>, initialState?: Partial<T>) {
    this._store = initialState
      ? (createStore(combinedReducers, initialState) as ReduxStore<T>)
      : createStore(combinedReducers);
  }

  dispatch(action: Action): void {
    this._store.dispatch(action);
    this.logging(action);
  }

  getState(): T {
    return this._store.getState();
  }

  subscribe(fn: () => void): Unsubscribe {
    return this._store.subscribe(fn);
  }

  getActionLog(): Action[] {
    return this.actionLog;
  }

  private logging(action: Action): void {
    this.actionLog.push(action);
  }
}
