const reduxDebounce = store => next => action => {
  // debug info
  console.group(action.type)
  console.info('dispatching', action)

  let result = next(action)

  // debug info
  console.log('next state', store.getState())
  console.groupEnd(action.type)

  return result;
}

export default reduxDebounce

