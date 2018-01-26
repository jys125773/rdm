import { delay } from 'redux-saga';
import { put, fork } from 'redux-saga/effects';

import { createModel, ACTIONS, SAGAS } from '../rdm';

export default createModel({
  nameSpace: 'counter',
  initialState: {
    value: 0,
  },
  handlers: {
    increment(state, action) {
     
      return { ...state, value: state.value + action.payload };
    },
    decrementAsync: {
      finish(state, action) {
        return { ...state, value: state.value - action.payload };
      },
    }
  },
  sagas: {
    *decrementAsync(action) {
      yield delay(1000);
      yield put(ACTIONS.combinedFooBar.counter.decrementAsyncFinish(1));
      yield fork(SAGAS.combinedFooBar.counter._decrementAsync, action);
    },
    *_decrementAsync(action) {
      yield delay(1000);
      yield put(ACTIONS.combinedFooBar.counter.decrementAsyncFinish(1))
    }
  }
})