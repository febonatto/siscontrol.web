export function isObject(object: unknown): boolean {
  return (
    object !== null && typeof object === 'object' && !Array.isArray(object)
  );
}

export function removeUndefinedProperties<T extends object>(object: T): T {
  return Object.fromEntries(
    Object.entries(object).filter(([_, value]) => value !== undefined),
  ) as T;
}
