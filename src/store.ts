import { createStore, Action, Reducer, Store as ReduxStore, Unsubscribe } from 'redux';
import { Observable, ReplaySubject } from 'rxjs';
import { map, concatMap, mergeMap, switchMap } from 'rxjs/operators';

export type ActionTypes = Action | Promise<Action> | Observable<Action>;

export interface Dispatcher<A> {
  dispatch: (action: A) => void;
}

export interface StoreOptions {
  logging?: boolean;
}

export class Store<T> {
  private readonly _store: ReduxStore<T>;
  private actionLog: Action[] = [];
  private _queue$ = new ReplaySubject<ActionTypes>(1);
  private _concurrent$ = new ReplaySubject<ActionTypes>(1);
  private _cancelable$ = new ReplaySubject<ActionTypes>(1);
  private actions$: Observable<Action>;
  private options: StoreOptions;

  get queue$(): Dispatcher<ActionTypes> {
    return {
      dispatch: (action: ActionTypes) => this._queue$.next(action)
    };
  }
  get concurrent$(): Dispatcher<ActionTypes> {
    return {
      dispatch: (action: ActionTypes) => this._concurrent$.next(action)
    };
  }
  get cancelable$(): Dispatcher<ActionTypes> {
    return {
      dispatch: (action: ActionTypes) => this._cancelable$.next(action)
    };
  }

  constructor(combinedReducers: Reducer<T>, initialState?: Partial<T>, options?: StoreOptions) {
    this._store = initialState
      ? (createStore(combinedReducers, initialState) as ReduxStore<T>)
      : createStore(combinedReducers);

    this.options = options || {};

    this.actions$ = Observable.merge(
      this._queue$.pipe(
        map(
          action =>
            action instanceof Observable || action instanceof Promise
              ? action
              : Observable.of(action)
        ),
        concatMap(promise => promise)
      ),
      this._concurrent$.pipe(
        map(
          action =>
            action instanceof Observable || action instanceof Promise
              ? action
              : Observable.of(action)
        ),
        mergeMap(promise => promise)
      ),
      this._cancelable$.pipe(
        map(
          action =>
            action instanceof Observable || action instanceof Promise
              ? action
              : Observable.of(action)
        ),
        switchMap(promise => promise)
      )
    );

    this.actions$.subscribe(action => {
      this.dispatch(action);
    });
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

  completeForTesting(): Promise<Action[]> {
    const promise = this.actions$.toPromise();
    this._queue$.complete();
    this._concurrent$.complete();
    this._cancelable$.complete();
    return promise.then(() => this.getActionLog());
  }

  private dispatch(action: Action): void {
    this.logging(action);
    this._store.dispatch(action);
  }

  private logging(action: Action): void {
    if (this.options.logging) {
      this.actionLog.push(action);
    }
  }
}
