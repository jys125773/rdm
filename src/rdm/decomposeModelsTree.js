
export default function decomposeModelsTree(
  modelsTree,
  actionsMap = {},
  reducersMap = {},
  sagasMap = {},
  spaceNamePathsKey = '',
) {

  for (let k in modelsTree) {
    const branch = modelsTree[k];
    const curSpaceNamePathsKey = spaceNamePathsKey + k + '.';

    if (branch.nameSpace) {
      if (branch.nameSpace !== k) {
        throw new Error('The variable name of the exported model must be equal to the nameSpace in model');
      }

      const { actions, reducer } = branch.actionsAndReducerCreator(curSpaceNamePathsKey);

      actionsMap[k] = actions;
      reducersMap[k] = reducer;
      sagasMap[k] = branch.sagas;
    } else {
      actionsMap[k] = {};
      reducersMap[k] = {};
      sagasMap[k] = {};

      decomposeModelsTree(branch, actionsMap[k], reducersMap[k], sagasMap[k], curSpaceNamePathsKey);
    }
  }

  return { actionsMap, reducersMap, sagasMap };
}