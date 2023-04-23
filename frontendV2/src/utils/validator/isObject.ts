function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && !(value instanceof Array);
}

export default isObject;
