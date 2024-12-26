export type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type GetFunctionParams<T extends (...args: any) => void> = Parameters<T>;
