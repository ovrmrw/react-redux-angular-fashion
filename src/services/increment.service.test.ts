import '../polyfills';
import { IncrementService } from './increment.service';
import { prepareContainerForTesting } from '../DI';
import { Store } from '../store';

describe('IncrementService', () => {
  let store: Store<any>;
  let incrementService: IncrementService;

  beforeEach(() => {
    const container = prepareContainerForTesting();
    store = container.get(Store);
    incrementService = container.get(IncrementService);
  });

  describe('Store', () => {
    it('INCREMENT action is dispatched when increment function is called.', () => {
      expect.assertions(2);
      expect(store.getActionLog()).toEqual([]);
      incrementService.increment();
      expect(store.getActionLog()).toEqual([{ type: 'INCREMENT' }]);
    });

    it('DECREMENT action is dispatched when decrement function is called.', () => {
      expect.assertions(2);
      expect(store.getActionLog()).toEqual([]);
      incrementService.decrement();
      expect(store.getActionLog()).toEqual([{ type: 'DECREMENT' }]);
    });

    it('ASYNC_INCREMENT action is dispatched when asyncIncrement function is called.', async () => {
      expect.assertions(2);
      expect(store.getActionLog()).toEqual([]);
      incrementService.asyncIncrement();
      await store.completeForTesting().then(() => {
        expect(store.getActionLog()).toEqual([{ type: 'ASYNC_INCREMENT' }]);
      });
    });

    it('ASYNC_DECREMENT action is dispatched when asyncDecrement function is called.', async () => {
      expect.assertions(2);
      expect(store.getActionLog()).toEqual([]);
      incrementService.asyncDecrement();
      incrementService.decrement();
      incrementService.asyncIncrement();
      await store.completeForTesting().then(() => {
        expect(store.getActionLog()).toEqual([
          { type: 'DECREMENT' },
          { type: 'ASYNC_DECREMENT' },
          { type: 'ASYNC_INCREMENT' }
        ]);
      });
    });
  });
});
