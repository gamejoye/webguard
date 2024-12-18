/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebGuard } from '@webguard/core';

export function setupErrorTests(guard: WebGuard) {
  document.getElementById('errorBtn')?.addEventListener('click', () => {
    (function myErrorFunction() {
      (window as any).a.b = 123;
    })();
  });

  document.getElementById('referenceBtn')?.addEventListener('click', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    nonExistentFunction();
  });
}
