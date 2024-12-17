export function isSameOrigin(url: string, origin: string): boolean {
  try {
    const urlObj = new URL(url);
    const originObj = new URL(origin);
    return urlObj.origin === originObj.origin && urlObj.origin !== 'null';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return false;
  }
}
