import { TargetOptions } from './common';
export function stringifyTarget({ target }: TargetOptions) {
  if (target instanceof HTMLElement) {
    return target.outerHTML;
  }
  return target + '';
}

export * from './common';
