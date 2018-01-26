export default function createAction(actionType, systemMeta) {
  return (payload, customizedMeta) => ({
    type: actionType,
    payload,
    meta: { ...customizedMeta, ...systemMeta }
  });
}