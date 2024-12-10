import { BaseLog } from "@web-guard/types";

function serializeLog(log: BaseLog): string {
  const expectedKeys = Object.keys(log).sort();
  return JSON.stringify(log, expectedKeys);
}

export function getUUIDFromLog(log: BaseLog): string {
  return serializeLog(log);
}