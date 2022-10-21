function setDebounceCallback<Parameter extends any[]>(
  callback: (...parameter: Parameter) => void,
  delay: number,
) {
  let currentTimer: NodeJS.Timeout | undefined;

  const timeoutCallback = (parameter: Parameter) => () => {
    callback(...parameter);
    currentTimer = undefined;
  };

  const debouncedCallback = (...callbackParameter: Parameter): void => {
    clearTimeout(currentTimer);
    currentTimer = setTimeout(timeoutCallback(callbackParameter), delay);
  };

  return debouncedCallback;
}

export default setDebounceCallback;
