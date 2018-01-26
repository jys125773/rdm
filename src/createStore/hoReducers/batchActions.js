export default function batchActions(reducer, batchActionType = '@@redux/BATCH_ACTIONS') {
  return function loopReducer(state, action) {
    return action.type === batchActionType
      ? action.payload.reduce(loopReducer, state)
      : reducer(state, action);
  }
}