/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebGuard } from '@webguard/core';

export function setupPromiseTests(guard: WebGuard) {
  document.getElementById('promiseErrorBtn')?.addEventListener('click', () => {
    Promise.reject(new Error('Promise Rejection Test'));
  });

  document.getElementById('asyncErrorBtn')?.addEventListener('click', async () => {
    await Promise.resolve();
    (function myAsyncFunction() {
      (window as any).a.b = 123;
    })();
  });

  document.getElementById('promiseErrorBasetypeBtn')?.addEventListener('click', () => {
    Promise.reject('String Error');
  });
}
