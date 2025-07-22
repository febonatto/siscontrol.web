export function isObject(object: unknown): boolean {
  return (
    object !== null && typeof object === 'object' && !Array.isArray(object)
  );
}
