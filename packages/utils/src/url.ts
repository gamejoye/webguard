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

export function getUrlFromFetchArgs(args: Parameters<typeof fetch>) {
  return typeof args[0] === 'string'
    ? args[0]
    : Object.prototype.toString.call(args[0]) === '[object Request]'
      ? (args[0] as Request).url
      : (args[0] as URL).toString();
}
