import { Guard } from '@webguard/core';
import { ApiPerformancePlugin } from '@webguard/api-performance';
function initApiPerformanceMetrics() {
  Guard.init({
    targetUrl: 'http://localhost:3001/data',
    plugins: [new ApiPerformancePlugin({})],
  });

  const apiBase = 'https://httpstat.us';

  // Fetch 请求
  document.getElementById('fetch200')?.addEventListener('click', () => {
    fetch(`${apiBase}/200`)
      .then(res => res.text())
      .then(data => console.log('Fetch 200 成功:', data))
      .catch(err => console.error('Fetch 错误:', err));
  });

  document.getElementById('fetch400')?.addEventListener('click', () => {
    fetch(`${apiBase}/400`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.text();
      })
      .catch(err => console.error('Fetch 400 错误:', err));
  });

  document.getElementById('fetch500')?.addEventListener('click', () => {
    fetch(`${apiBase}/500`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.text();
      })
      .catch(err => console.error('Fetch 500 错误:', err));
  });

  // XHR 请求
  document.getElementById('xhr200')?.addEventListener('click', () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${apiBase}/200`);
    xhr.send();
  });

  document.getElementById('xhr400')?.addEventListener('click', () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${apiBase}/400`);
    xhr.send();
  });

  document.getElementById('xhr500')?.addEventListener('click', () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${apiBase}/500`);
    xhr.send();
  });
}

// 启动性能数据采集
initApiPerformanceMetrics();
