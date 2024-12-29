function serialize(obj: Record<string, any>): string {
  const expectedKeys = Object.keys(obj).sort();
  return JSON.stringify(obj, expectedKeys);
}

export function getUUID<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  excludeKeys: K[] = []
): string {
  for (const key of Object.keys(obj)) {
    if (excludeKeys.includes(key as K)) {
      delete obj[key];
    }
  }
  return serialize(obj);
}
