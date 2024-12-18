import { IBaseLog } from '@webguard/types';

function serializeLog(log: IBaseLog): string {
  const expectedKeys = Object.keys(log).sort();
  return JSON.stringify(log, expectedKeys);
}

export function getUUIDFromLog(log: IBaseLog): string {
  return serializeLog(log);
}
