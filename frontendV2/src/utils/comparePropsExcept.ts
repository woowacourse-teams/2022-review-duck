const comparePropsWithOmit =
  <T extends object>(omit: (keyof T)[]) =>
  (previous: T, current: T) => {
    const propKeys = Object.keys(previous) as (keyof T)[];
    const compareKeys = propKeys.filter((key) => !omit.includes(key));

    return compareKeys.every((key) => {
      return previous[key] === current[key];
    });
  };

export default comparePropsWithOmit;
