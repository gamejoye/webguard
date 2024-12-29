/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebGuard } from '@webguard/core';
export function setupAsyncTests(guard: WebGuard) {
  const fetchBtn = document.getElementById('fetchBtn');
  if (fetchBtn) {
    fetchBtn.addEventListener('click', () => {
      fetch('https://httpstat.us/404');
    });
  }
  const fetchErrorBtn = document.getElementById('fetchErrorBtn');
  if (fetchErrorBtn) {
    fetchErrorBtn.addEventListener('click', () => {
      fetch('https://www.baidu.com');
    });
  }
  const xhrBtn = document.getElementById('xhrBtn');
  if (xhrBtn) {
    xhrBtn.addEventListener('click', () => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://httpstat.us/404');
      xhr.send();
    });
  }

  const xhrErrorBtn = document.getElementById('xhrErrorBtn');
  if (xhrErrorBtn) {
    xhrErrorBtn.addEventListener('click', () => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://www.baidu.com');
      xhr.send();
    });
  }

  const xhrTimeoutBtn = document.getElementById('xhrTimeoutBtn');
  if (xhrTimeoutBtn) {
    xhrTimeoutBtn.addEventListener('click', () => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://httpstat.us/200');
      xhr.timeout = 500;
      xhr.setRequestHeader('X-HttpStatus-Sleep', '2000'); // 延迟5秒响应
      xhr.send();
    });
  }

  const xhrCorrectBtn = document.getElementById('xhrCorrectBtn');
  if (xhrCorrectBtn) {
    xhrCorrectBtn.addEventListener('click', () => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://httpstat.us/200');
      xhr.send();
    });
  }
}
