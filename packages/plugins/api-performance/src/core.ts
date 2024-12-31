import { WINDOW } from '@webguard/common';
import {
  ApiPerformancePluginConfig,
  ExtraXMLHttpRequest,
  IMonitorReporter,
  IPlugin,
  PluginContext,
} from '@webguard/types';
import { fill, getUrlFromFetchArgs } from '@webguard/utils';
import { ApiPerformanceLog } from './models/log';

export class ApiPerformancePlugin implements IPlugin {
  #name: string = 'ApiPerformance';
  config: ApiPerformancePluginConfig;
  reporter!: IMonitorReporter;
  log: ApiPerformanceLog;
  constructor(config: ApiPerformancePluginConfig = {}) {
    this.config = config;
    this.log = new ApiPerformanceLog();
  }
  apply(context: PluginContext): void {
    this.reporter = context.reporter;
    this.fillFetch();
    this.fillXHR();
    WINDOW.document.addEventListener('visibilitychange', () => {
      if (WINDOW.document.visibilityState === 'hidden' && this.log.totalRequests) {
        this.reporter.send(this.log);
        this.log = new ApiPerformanceLog();
      }
    });
  }

  get name() {
    return this.#name;
  }

  fillFetch() {
    if (!WINDOW.fetch) {
      console.warn('fetch is not supported');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    fill(WINDOW, 'fetch', function apiPerformanceFetchFactory(originalFetch) {
      return function apiPerformanceFetch(...args: Parameters<typeof originalFetch>) {
        const url = getUrlFromFetchArgs(args);
        const method = args[1]?.method ?? 'GET';
        const start = performance.now();
        return originalFetch(...args)
          .then(res => {
            that.log.addApiPerformanceData({
              url,
              method,
              time: performance.now() - start,
              status: res.ok ? 'success' : 'failed',
            });
            return res;
          })
          .catch(err => {
            that.log.addApiPerformanceData({
              url,
              method,
              time: performance.now() - start,
              status: 'failed',
            });
            throw err;
          });
      };
    });
  }

  fillXHR() {
    const XHR = WINDOW.XMLHttpRequest;
    if (!XHR) {
      console.warn('XMLHttpRequest is not supported');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    fill(XHR.prototype, 'open', function apiPerformanceOpenFactory(originalOpen) {
      return function apiPerformanceOpen(
        this: ExtraXMLHttpRequest,
        method: string,
        url: string | URL,
        async: boolean = true,
        username?: string | null,
        password?: string | null
      ) {
        this.method = method;
        this.requestURL = typeof url === 'string' ? url : url.toString();
        this.url = url;
        return originalOpen.apply(this, [method, url, async, username, password]);
      };
    });

    fill(XHR.prototype, 'send', function apiPerformanceSendFactory(originalSend) {
      return function apiPerformanceSend(
        this: ExtraXMLHttpRequest,
        ...args: Parameters<typeof originalSend>
      ) {
        let start: number = performance.now();
        function handler(e: ProgressEvent<ExtraXMLHttpRequest>) {
          const { url, method, status, readyState } = e.target!;
          const isSuccess =
            readyState === XHR.DONE && ((status + '').startsWith('2') || status === 304);
          that.log.addApiPerformanceData({
            url: url.toString(),
            method,
            time: performance.now() - start,
            status: isSuccess ? 'success' : 'failed',
          });
        }
        this.addEventListener('loadstart', () => {
          start = performance.now();
        });
        this.addEventListener('error', e => handler(e as ProgressEvent<ExtraXMLHttpRequest>));
        this.addEventListener('loadend', e => handler(e as ProgressEvent<ExtraXMLHttpRequest>));
        this.addEventListener('timeout', e => handler(e as ProgressEvent<ExtraXMLHttpRequest>));
        return originalSend.apply(this, args);
      };
    });
  }
}
