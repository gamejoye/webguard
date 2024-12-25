import { getFP, getFCP, getLCP, getCLS, getINP, getTTFB } from '@webguard/performance';

// 更新UI的工具函数
function updateMetric(id: string, value: number) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value.toFixed(5);
  }
}

// 初始化性能数据
function initPerformanceMetrics() {
  getFP(({ value }) => updateMetric('fp-value', value));
  getFCP(({ value }) => updateMetric('fcp-value', value));
  getLCP(({ value }) => updateMetric('lcp-value', value));
  getINP(({ value }) => updateMetric('inp-value', value));
  getCLS(({ value }) => updateMetric('cls-value', value));
  getTTFB(({ value }) => updateMetric('ttfb-value', value));
}

// 启动性能数据采集
initPerformanceMetrics();
