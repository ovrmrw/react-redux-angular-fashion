import getDecorators from 'inversify-inject-decorators';
import { Container } from 'inversify';
import { Store } from '../store';
import { reducers, AppState } from '../reducer';
import { IncrementService } from '../services/increment.service';

const initialState: Partial<AppState> = {
  counter: 1000
};

const rootContainer = new Container();
rootContainer.bind(Store).toConstantValue(new Store(reducers, initialState));
rootContainer.bind(IncrementService).toSelf();

const container = rootContainer.createChild();

export const { lazyInject } = getDecorators(container);

export function prepareContainerForTesting(): Container {
  const testContainer = container.createChild();
  if (process.env.NODE_ENV === 'test') {
    testContainer.unbindAll();
    testContainer.bind(Store).toConstantValue(new Store(reducers));
    testContainer.bind(IncrementService).toSelf();
  }
  return testContainer;
}
