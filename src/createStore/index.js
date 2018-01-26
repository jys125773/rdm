import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import recycleState from 'redux-recycle';

import loggerMiddleware from './middleWares/logger';
import debounceMiddleware from './middleWares/debounce';
import batchActions from './hoReducers/batchActions';
import { combineModels } from '../rdm';
import { counter, foo, bar } from '../model';

const modelsTree = {
  combinedFooBar: {
    counter,
    foo,
    bar,
  },
};

const hoReducers = {
  'root'(reducer) {

    return [
      batchActions(reducer, '@@redux/BATCH_ACTIONS'),
    ];
  },
  'combinedFooBar'(reducer) {

    return [
      recycleState(reducer, ['reset_combinedFooBar']),
    ];
  },
  'combinedFooBar.counter'(reducer) {

    return [
      recycleState(reducer, ['reset_combinedFooBar.counter']),
    ];
  },
};

export default function customizedCreateStore() {
  const { rootReducer, rootSaga } = combineModels(modelsTree);
  const sagaMiddleware = createSagaMiddleware(rootSaga);

  const store = compose(
    applyMiddleware(sagaMiddleware, loggerMiddleware, debounceMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore)(rootReducer);

  sagaMiddleware.run(rootSaga);
  return store;
}