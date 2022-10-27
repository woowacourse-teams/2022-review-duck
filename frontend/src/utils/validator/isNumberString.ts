export default function isNumberString(value: unknown): value is numberString {
  return /[0-9]$/.test(String(value));
}
