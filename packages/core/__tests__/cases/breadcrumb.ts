/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebGuard } from '@web-guard/core';
import { breadcrumb } from '../../src/breadcrumb';
export function setupBreadcrumbTests(guard: WebGuard) {
  document.getElementById('normalClickBtn')?.addEventListener('click', () => {
    console.log('Normal click test');
  });

  document.getElementById('testInput')?.addEventListener('keyup', e => {
    console.log('Input test');
  });

  document.getElementById('showBreadcrumbBtn')?.addEventListener('click', () => {
    console.log(breadcrumb.getStack());
  });
}
