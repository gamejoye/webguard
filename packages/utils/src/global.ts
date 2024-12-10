import { EventMaps } from "@web-guard/types";

function getGlobal(): Window {
  return window as unknown as Window;
}
function getIsBrowerEnv(): boolean {
  return window !== undefined;
}

export const isBrowerEnv = getIsBrowerEnv();
export const webGuardGlobal = getGlobal();

const flags = new Set();
export function getFlag(event: keyof EventMaps) {
  return flags.has(event);
}
export function setFlag(event: keyof EventMaps, tag: boolean) {
  if (tag) flags.add(event);
  else flags.delete(event);
}
export function initFlags(flagEntries: [keyof EventMaps, boolean][]) {
  flags.clear();
  for (const entry of flagEntries) setFlag(entry[0], entry[1])
}