import { injectable, inject } from 'inversify';
import { Action } from 'redux';
import { lazyInject } from '../DI';
import { Store } from '../store';
import { AppState } from '../reducer';

@injectable()
export class IncrementService {
  constructor(@inject(Store) private store: Store<AppState>) {}

  increment(): void {
    this.store.queue$.dispatch({ type: 'INCREMENT' });
  }

  decrement(): void {
    this.store.queue$.dispatch({ type: 'DECREMENT' });
  }

  asyncIncrement(): void {
    const promise = new Promise<Action>(resolve => {
      setTimeout(() => {
        resolve({ type: 'ASYNC_INCREMENT' });
      }, 1000);
    });
    this.store.concurrent$.dispatch(promise);
  }

  asyncDecrement(): void {
    const promise = new Promise<Action>(resolve => {
      setTimeout(() => {
        resolve({ type: 'ASYNC_DECREMENT' });
      }, 1000);
    });
    this.store.concurrent$.dispatch(promise);
  }
}
