import { injectable, inject } from 'inversify';
import { lazyInject } from '../DI';
import { Store } from '../store';
import { AppState } from '../reducer';

@injectable()
export class IncrementService {
  constructor(@inject(Store) private store: Store<AppState>) {}

  increment(): void {
    this.store.dispatch({ type: 'INCREMENT' });
  }

  decrement(): void {
    this.store.dispatch({ type: 'DECREMENT' });
  }

  asyncIncrement(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.store.dispatch({ type: 'ASYNC_INCREMENT' });
        resolve();
      }, 1000);
    });
  }

  asyncDecrement(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.store.dispatch({ type: 'ASYNC_DECREMENT' });
        resolve();
      }, 1000);
    });
  }
}
