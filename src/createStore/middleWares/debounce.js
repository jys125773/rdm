const timers = {};

export default function debounce() {
  return next => action => {
    const { meta: { debounce = {} } = {}, type } = action;
    const { time, key = type, cancel = false } = debounce;
    const shouldDebounce = (time && key) || (cancel && key);

    if (!shouldDebounce) {
      return next(action);
    }

    if (timers[key]) {
      clearTimeout(timers[key]);
    }

    if (!cancel) {
      return new Promise(resolve => {
        timers[key] = setTimeout(() => {
          resolve(next(action));
        }, time);
      })
    }
  };
}