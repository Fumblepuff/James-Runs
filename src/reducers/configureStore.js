
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

export default (rootReducer) => {
  let reduxComposeWith;
  const reduxEnhancers = [];

  const reduxMiddleware = applyMiddleware(thunk, createLogger());
  reduxEnhancers.push(reduxMiddleware);

  if (__DEV__) {
    reduxComposeWith = composeWithDevTools({})(...reduxEnhancers);
  } else {
    reduxComposeWith = compose(...reduxEnhancers);
  }

  const store = createStore(rootReducer, reduxComposeWith);
  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
};
