export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

export function isArrayOf<T>(
  value: unknown,
  check: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(check);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isTypeOrNull(
  value: unknown,
  // eslint-disable-next-line no-unused-vars
  verifier: (value: unknown) => boolean
): boolean {
  if (value === null) return true;
  return verifier(value);
}
