
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import createStore from 'src/reducers';

import AppContainer from './AppContainer';

const { store, persistor } = createStore();

class RootContainer extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={null}
          persistor={persistor}
        >
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }
}

export default RootContainer;
