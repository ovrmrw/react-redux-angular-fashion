import * as React from 'react';
import { lazyInject } from './DI';
import { Store } from './store';
import { AppState } from './reducer';
import { IncrementService } from './services/increment.service';
import './App.css';

const logo = require('./logo.svg');

class App extends React.PureComponent {
  @lazyInject(Store) store: Store<AppState>;
  @lazyInject(IncrementService) incrementServce: IncrementService;

  constructor(props: any) {
    super(props);
    this.state = { ...this.state, ...this.store.getState() };
  }

  componentWillMount() {
    this.store.subscribe(() => {
      this.setState({ ...this.state, ...this.store.getState() });
    });
  }

  increment() {
    this.incrementServce.increment();
  }

  asyncIncrement() {
    this.incrementServce.asyncIncrement();
  }

  render() {
    const s = this.state as AppState;
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
          counter: {s.counter} 
          asyncCounter: {s.asyncCounter}
        </p>
        <div>
          <button onClick={() => this.increment()}>Increment</button>
        </div>
        <div>
          <button onClick={() => this.asyncIncrement()}>AsyncIncrement</button>
        </div>
      </div>
    );
  }
}

export default App;
