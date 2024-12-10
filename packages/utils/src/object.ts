export function fill<T, K extends keyof T>(
  obj: T,
  key: K,
  factory: (original: T[K]) => T[K]
): T[K] {
  const original = obj[key];
  const wrapper = factory(original);
  obj[key] = wrapper;

  // 保留原型链
  try {
    const proto = Object.getPrototypeOf(original);
    Object.setPrototypeOf(wrapper, proto);
    Object.setPrototypeOf(original, proto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {}

  return wrapper;
}
