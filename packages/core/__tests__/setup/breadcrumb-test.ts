/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebGuard } from '@webguard/core';
import { breadcrumb } from '../../src/breadcrumb';
export function setupBreadcrumbTests(guard: WebGuard) {
  document.getElementById('normalClickBtn')?.addEventListener('click', () => {
    console.log('Normal click test');
  });

  document.getElementById('historyPushState')?.addEventListener('click', () => {
    history.pushState({ foo: 'bar' }, '', 'pushed-state.html');
  });

  document.getElementById('historyReplaceState')?.addEventListener('click', () => {
    history.replaceState({ bar: 'foo' }, '', 'replaced-state.html');
  });

  document.getElementById('historyForward')?.addEventListener('click', () => {
    history.forward();
  });

  document.getElementById('historyBack')?.addEventListener('click', () => {
    history.back();
  });

  document.getElementById('testInput')?.addEventListener('keyup', e => {
    console.log('Input test');
  });

  document.getElementById('showBreadcrumbBtn')?.addEventListener('click', () => {
    console.log(breadcrumb.getStack());
  });
}
