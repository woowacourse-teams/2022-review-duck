export default function isNotNull(value: unknown): value is NonNullable<unknown> {
  return value !== null;
}
