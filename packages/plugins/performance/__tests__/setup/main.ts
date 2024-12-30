import { Guard } from '@webguard/core';
import { PerformancePlugin } from '@webguard/performance';

// 更新UI的工具函数
function updateMetric(id: string, value: number) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value.toFixed(5);
  }
}

// 初始化性能数据
function initPerformanceMetrics() {
  Guard.init({
    targetUrl: 'http://localhost:3001/data',
    plugins: [
      new PerformancePlugin({
        onFP: ({ value }) => updateMetric('fp-value', value),
        onFCP: ({ value }) => updateMetric('fcp-value', value),
        onLCP: ({ value }) => updateMetric('lcp-value', value),
        onINP: ({ value }) => updateMetric('inp-value', value),
        onCLS: ({ value }) => updateMetric('cls-value', value),
        onTTFB: ({ value }) => updateMetric('ttfb-value', value),
      }),
    ],
  });
}

// 启动性能数据采集
initPerformanceMetrics();
