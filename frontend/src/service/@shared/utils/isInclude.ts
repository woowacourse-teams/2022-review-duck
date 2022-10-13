function isInclude<T extends readonly string[]>(
  array: T,
  value: string | null,
): value is T[number] {
  return array.includes(String(value));
}

export default isInclude;
