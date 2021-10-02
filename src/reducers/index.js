
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import reducers from './reducers';
import configureStore from './configureStore';

const createStore = () => {
  /* ------------- Persist Redux START ------------- */
  const {
    auth,
    ...otherReducers
  } = reducers;

  const rootPersistConfig = {
    key: 'primary',
    storage: AsyncStorage,
    whitelist: [],
  };

  const authPersistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    whitelist: ['appleLogin'],
  };

  const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, auth),
    ...otherReducers,
  });

  const persistReducers = persistReducer(rootPersistConfig, rootReducer);
  /* ------------- Persist Redux END ------------- */

  const configureStoreData = configureStore(persistReducers);
  const { store, persistor } = configureStoreData;

  return { store, persistor };
};

export default createStore;
