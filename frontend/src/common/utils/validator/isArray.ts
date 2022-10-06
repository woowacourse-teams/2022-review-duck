function isArray(value: unknown): value is unknown[] {
  return typeof value === 'object' && value instanceof Array;
}

export default isArray;
