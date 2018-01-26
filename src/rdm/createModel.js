import createReducer from './createReducer';
import createAction from './createAction';

export default function createModel({ nameSpace, initialState = {}, handlers = {}, sagas = {} }) {

  if (nameSpace.indexOf('.') !== -1) {
    throw new Error('nameSpace can not cantain "."');
  }

  function actionsAndReducerCreator(spaceNamePathsKey) {
    const actions = {};
    const finalHandlers = {};

    const handlersKeys = Object.keys(handlers);

    if (handlersKeys.length) {
      handlersKeys.forEach(handlerKey => {
        const handler = handlers[handlerKey];

        if (typeof handler === 'function') {
          const actionName = handlerKey;
          const actionType = spaceNamePathsKey + actionName;

          actions[actionName] = createAction(actionType);
          finalHandlers[actionType] = handler;

        } else if (typeof handler === 'object') {
          handler && Object.keys(handler).forEach(sagaPhaseKey => {
            const actionName = `${handlerKey}${sagaPhaseKey.slice(0, 1).toUpperCase() + sagaPhaseKey.slice(1)}`;
            const actionType = spaceNamePathsKey + actionName;

            actions[actionName] = createAction(actionType, { phase: sagaPhaseKey });
            finalHandlers[actionType] = handler[sagaPhaseKey];
          });
        }
      });
    }

    const sagasKeys = Object.keys(sagas);

    if (sagasKeys.length) {
      sagasKeys.forEach(sagaKey => {
        const actionType = spaceNamePathsKey + sagaKey;
        actions[sagaKey] = createAction(actionType, { phase: 'saga' });
      });
    }

    const reducer = createReducer(initialState, finalHandlers);

    return { actions, reducer };
  }

  return { actionsAndReducerCreator, sagas, nameSpace, initialState };
}