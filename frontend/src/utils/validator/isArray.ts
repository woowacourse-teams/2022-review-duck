function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export default isArray;
