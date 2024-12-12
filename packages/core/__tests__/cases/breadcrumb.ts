/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebGuard } from '@web-guard/core';

export function setupBreadcrumbTests(guard: WebGuard) {
  document.getElementById('normalClickBtn')?.addEventListener('click', () => {
    console.log('Normal click test');
  });

  document.getElementById('testInput')?.addEventListener('keyup', e => {
    console.log('Input test');
  });
}
