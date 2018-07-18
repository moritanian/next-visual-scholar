import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers/index';

export default function configureStore(initialState, isServer) {
  if (isServer && typeof window === 'undefined') {
    return createStore(rootReducer, initialState);
  } else {
    if (!window.store) {
      window.store = createStore ( rootReducer, initialState);
    }
    return window.store;
  }
}

