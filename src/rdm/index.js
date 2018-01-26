import createModel from './createModel';
import decomposeModelsTree from './decomposeModelsTree';
import customizedCombineReducers from './combineReducers';
import getRootSaga from './getRootSaga';

export let ACTIONS = {};
export let SAGAS = {};

export function combineModels(modelsTree, hoReducers) {
  const { actionsMap, reducersMap, sagasMap } = decomposeModelsTree(modelsTree);

  ACTIONS = actionsMap;
  SAGAS = sagasMap;

  const rootReducer = customizedCombineReducers(reducersMap, hoReducers);
  const rootSaga = getRootSaga(SAGAS);

  return { rootReducer, rootSaga };
}

export { createModel }