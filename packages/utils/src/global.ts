import { Flags } from '@webguard/types';

const flags = new Set();
export function getFlag(event: Flags) {
  return flags.has(event);
}
export function setFlag(event: Flags, tag: boolean) {
  if (tag) flags.add(event);
  else flags.delete(event);
}
export function initFlags(flagEntries: [Flags, boolean][]) {
  flags.clear();
  for (const entry of flagEntries) setFlag(entry[0], entry[1]);
}
