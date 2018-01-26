import { combineReducers } from 'redux';

export default function customizedCombineReducers(reducersTree, hoReducers = {}) {
  const { flatedReducers, siblingsNameSpaceGroups } = flattenReducersTree(reducersTree, hoReducers);

  let parentPathKey, ownKey, index;
  Object.keys(siblingsNameSpaceGroups)
    .sort((a, b) => b - a)
    .forEach(depth => {

      siblingsNameSpaceGroups[depth].forEach(pathKey => {
        index = pathKey.lastIndexOf('.');

        if (index !== -1) {
          parentPathKey = pathKey.slice(0, index);
          ownKey = pathKey.slice(index + 1);

          let reducer = combineReducers(flatedReducers[pathKey]);

          const applyHoReducers = hoReducers[pathKey];
          if (applyHoReducers) {
            applyHoReducers(reducer).forEach(newReducer => {
              reducer = newReducer;
            });
          }

          flatedReducers[parentPathKey][ownKey] = reducer;
          delete flatedReducers[pathKey];
        } else {
          let reducer = combineReducers(flatedReducers[pathKey]);

          const applyHoReducers = hoReducers[pathKey];
          if (applyHoReducers) {
            applyHoReducers(reducer).forEach(newReducer => {
              reducer = newReducer;
            });
          }

          flatedReducers[pathKey] = reducer;
        }
      });
    });

  const outmostReducers = Object.keys(reducersTree).reduce((acc, k) => {
    if (typeof reducersTree[k] === 'function') {
      acc[k] = reducersTree[k];
    }
    return acc;
  }, flatedReducers);

  let rootReducer = combineReducers(outmostReducers);

  const applyHoReducers = hoReducers.root;
  if (applyHoReducers) {
    applyHoReducers(rootReducer).forEach(newReducer => {
      rootReducer = newReducer;
    });
  }

  return rootReducer;
}


function flattenReducersTree(
  reducersTree,
  hoReducers,
  flatedReducers = {},
  siblingsNameSpaceGroups = {},
  paths = [],
) {
  let curPaths, curPathKey, pathsDepth;

  for (let k in reducersTree) {
    curPaths = paths.concat(k);
    curPathKey = curPaths.join('.');
    pathsDepth = curPaths.length;
    if (typeof reducersTree[k] === 'object') {

      if (siblingsNameSpaceGroups[pathsDepth]) {
        siblingsNameSpaceGroups[pathsDepth].push(curPathKey);
      } else {
        siblingsNameSpaceGroups[pathsDepth] = [curPathKey];
      }

      flatedReducers[curPathKey] = reducersTree[k];
      flattenReducersTree(reducersTree[k], hoReducers, flatedReducers, siblingsNameSpaceGroups, curPaths);
    } else {
      const applyHoReducers = hoReducers[curPathKey];

      if (applyHoReducers) {
        applyHoReducers(reducersTree[k]).forEach(newReducer => {
          reducersTree[k] = newReducer;
        });
      }
    }
  }

  return { flatedReducers, siblingsNameSpaceGroups };
}

