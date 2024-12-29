/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebGuard } from '@webguard/core';

export function setupScriptErrorTests(guard: WebGuard) {
  document.getElementById('scriptErrorBtn')?.addEventListener('click', () => {
    const script = document.createElement('script');
    script.src = 'http://localhost:3001/error.js';
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
  });

  document.getElementById('scriptErrorWithoutAnonymousBtn')?.addEventListener('click', () => {
    const script = document.createElement('script');
    script.src = 'http://localhost:3001/error.js';
    document.body.appendChild(script);
  });
}
