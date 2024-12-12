/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebGuard } from '@web-guard/core';

export function setupSourceTests(guard: WebGuard) {
  document.getElementById('sourceFetchJSErrorBtn')?.addEventListener('click', () => {
    const script = document.createElement('script');
    script.src = 'https://example.com/non-existent-script.js';
    document.head.appendChild(script);
  });

  document.getElementById('sourceFetchIMGErrorBtn')?.addEventListener('click', () => {
    const img = document.createElement('img');
    img.src = 'https://example.com/non-existent-image.jpg';
    document.body.appendChild(img);
  });

  document.getElementById('sourceFetchCSSErrorBtn')?.addEventListener('click', () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://example.com/non-existent-style.css';
    document.head.appendChild(link);
  });
}
