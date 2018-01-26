import { all, takeEvery, takeLatest } from 'redux-saga/effects';

export default function getRootSaga(sagasTree) {
  return function* rootSaga() {
    const sagas = getAllSagas(sagasTree);

    yield all(sagas);
  };
}

function getAllSagas(sagasTree, sagas = [], spaceNamePathsKey = '') {
  for (let k in sagasTree) {
    const branch = sagasTree[k];

    if (typeof branch === 'function') {
      if (k.charAt(0) === '_') {
        sagas.push(takeLatest(spaceNamePathsKey + k, branch));
      } else {
        sagas.push(takeEvery(spaceNamePathsKey + k, branch));
      }
    } else {
      getAllSagas(branch, sagas, spaceNamePathsKey + k + '.');
    }
  }

  return sagas;
}