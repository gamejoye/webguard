import { getPageUrl, getUserAgent, stringifyTarget, isSameOrigin } from '@web-guard/utils';
import { ErrorLog, Breadcrumb } from './models';
import { reporter } from './repoter';
import { breadcrumb } from './breadcrumb';
import { BreadcrumbLevel, BreadcrumbTypes, LogTypes } from '@web-guard/common';

type ExtraXMLHttpRequest = {
  method: string;
  requestURL: string;
};

export const EventHandlers = {
  handleError(e: ErrorEvent): void {
    /**
     * 跨域脚本错误情况
     * 1. 能得知跨域脚本的具体错误 => 判断是否同源 => 非同源 => 是跨域脚本错误
     * 2. 不能得知跨域脚本的具体错误 => 是跨域脚本错误
     */
    const isKnowError = e.colno !== 0 && e.lineno !== 0;
    const isCrossOrigin = !isKnowError || !isSameOrigin(e.filename, getPageUrl());
    const type = isCrossOrigin ? LogTypes.CROSSORIGIN_SCRIPT_ERROR : LogTypes.JS_ERROR;
    const log = new ErrorLog({
      type,
      pageUrl: getPageUrl(),
      userAgent: getUserAgent(),
      errorMessage: e.message,
      errorStack: typeof e.error?.stack === 'string' ? getStackLines(e.error.stack) : '',
      filename: e.filename,
      line: e.lineno,
      column: e.colno,
    });
    reporter.send(log);
  },
  handleResourceError(e: Event): void {
    if (e instanceof ErrorEvent) return;
    const target = e.target as HTMLElement;
    const src = getResourceUrl(target);
    const [filename, line, column] = getErrorLines(e);
    const errorStack = [
      `ResourceError: Failed to load ${target.tagName.toLowerCase()}`,
      `    at ${src}`,
      `    at ${getPageUrl()}`,
      // eslint-disable-next-line max-len
      `    element: <${target.tagName.toLowerCase()}${target.id ? ` id="${target.id}"` : ''}${target.className ? ` class="${target.className}"` : ''}>`,
      `    timestamp: ${new Date().toISOString()}`,
    ].join('\n');
    const log = new ErrorLog({
      type: LogTypes.RESOURCE_ERROR,
      pageUrl: getPageUrl(),
      userAgent: getUserAgent(),
      errorMessage: `Failed to load ${target.tagName.toLowerCase()}: ${src}`,
      errorStack,
      filename,
      line,
      column,
    });
    reporter.send(log);
  },
  handleUnHandledRejection(e: PromiseRejectionEvent): void {
    let message = '';
    let stack = '';
    const reason = e.reason;
    const [filename, line, column] = getErrorLines(e);
    if (typeof reason !== 'object' || reason === null) {
      message = reason + '';
    } else if (reason instanceof Error) {
      message = reason.message;
      if (reason.stack) stack = getStackLines(reason.stack);
    }

    const log = new ErrorLog({
      type: LogTypes.PROMISE_REJECTION_ERROR,
      pageUrl: getPageUrl(),
      userAgent: getUserAgent(),
      errorMessage: message,
      errorStack: stack,
      filename,
      line,
      column,
    });
    reporter.send(log);
  },
  handleClick(e: MouseEvent): void {
    const message = `user click ${stringifyTarget(e)}`;

    const breadcrumbData = new Breadcrumb({
      type: BreadcrumbTypes.CLICK,
      level: BreadcrumbLevel.INFO,
      message,
    });
    breadcrumb.push(breadcrumbData);
  },
  handleKeyDown(e: KeyboardEvent): void {
    const message = `user keydown ${e.key} at ${stringifyTarget(e)}`;
    const breadcrumbData = new Breadcrumb({
      type: BreadcrumbTypes.KEYBOARD,
      level: BreadcrumbLevel.INFO,
      message,
    });
    breadcrumb.push(breadcrumbData);
  },
  handleKeyUp(e: KeyboardEvent): void {
    const message = `user keyup ${e.key} at ${stringifyTarget(e)}`;
    const breadcrumbData = new Breadcrumb({
      type: BreadcrumbTypes.KEYBOARD,
      level: BreadcrumbLevel.INFO,
      message,
    });
    breadcrumb.push(breadcrumbData);
  },
  // 重写fetch
  fetchReplacer(originalFetch: typeof fetch) {
    return function (...args: Parameters<typeof fetch>) {
      return originalFetch(...args)
        .then(res => {
          if (!res.ok) {
            // 错误处理
            const init = args[1];
            const message = [
              `Failed to fetch ${res.url}`,
              `[status]: ${res.status}`,
              `[statusText]: ${res.statusText}`,
              `[method]: ${init?.method ?? 'GET'}`,
              `[body]: ${init?.body ?? ''}`,
              `[type]: ${res.type}`,
            ].join('\n');
            const log = new ErrorLog({
              type: LogTypes.REQUEST_ERROR,
              pageUrl: getPageUrl(),
              userAgent: getUserAgent(),
              errorMessage: message,
            });
            reporter.send(log);
          }
          return res;
        })
        .catch(error => {
          // 错误处理
          let filename = '';
          let line = -1;
          let column = -1;
          let message = 'Failed to fetch';
          if (error instanceof Error) {
            const info = getErrorStackInfo(error);
            filename = info.filename;
            line = info.line;
            column = info.column;
            message = error.message;
          }
          const log = new ErrorLog({
            type: LogTypes.REQUEST_ERROR,
            pageUrl: getPageUrl(),
            userAgent: getUserAgent(),
            errorMessage: message,
            errorStack: getStackLines(error.stack),
            filename,
            line,
            column,
          });
          reporter.send(log);
          throw error;
        });
    };
  },
  // 重写XMLHttpRequest
  xhrReplacer(originalXHR: typeof XMLHttpRequest) {
    const originalSend = originalXHR.prototype.send;
    const originalOpen = originalXHR.prototype.open;
    const shouldSkipHandler = (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
      const status = (e.target as XMLHttpRequest & ExtraXMLHttpRequest).status;
      const type = e.type;
      // 正常情况 + 超时情况/错误情况 触发的loadend
      return (type === 'loadend' && status === 0) || (status + '').startsWith('2');
    };
    originalXHR.prototype.open = function open(
      this: XMLHttpRequest & ExtraXMLHttpRequest,
      method: string,
      url: string | URL,
      async: boolean = true,
      username?: string | null,
      password?: string | null
    ) {
      this.method = method;
      this.requestURL = typeof url === 'string' ? url : url.toString();
      return originalOpen.apply(this, [method, url, async, username, password]);
    };
    originalXHR.prototype.send = function send(
      this: XMLHttpRequest & ExtraXMLHttpRequest,
      ...args: Parameters<typeof originalSend>
    ) {
      const handler = function (e: ProgressEvent<XMLHttpRequestEventTarget>) {
        const { responseURL, requestURL, status, statusText, method, responseText } =
          e.target as XMLHttpRequest & ExtraXMLHttpRequest;
        if (shouldSkipHandler(e)) return;
        const message = [
          `Failed to XHR ${responseURL || requestURL}`,
          `[status]: ${status}`,
          `[statusText]: ${statusText}`,
          `[method]: ${method}`,
          `[body]: ${responseText}`,
          `[xhr listener type]: ${e.type}`,
        ].join('\n');
        const log = new ErrorLog({
          type: LogTypes.REQUEST_ERROR,
          pageUrl: getPageUrl(),
          userAgent: getUserAgent(),
          errorMessage: message,
        });
        reporter.send(log);
      };
      this.addEventListener('error', handler);
      this.addEventListener('loadend', handler);
      this.addEventListener('timeout', handler);
      return originalSend.apply(this, args);
    };
  },
};

const getStackLines = (stack: string) => {
  return stack
    .split('\n')
    .slice(1)
    .map(line => line.replace(/^\s+at\s+/g, ''))
    .join(' -> ');
};

const getResourceUrl = (target: HTMLElement) => {
  if (target instanceof HTMLScriptElement) {
    return target.src;
  } else if (target instanceof HTMLImageElement) {
    return target.src;
  } else if (target instanceof HTMLLinkElement) {
    return target.href;
  }
  return '';
};

const getErrorStackInfo = (error: Error) => {
  let filename = '';
  let line = -1;
  let column = -1;
  if (error.stack) {
    const matchResult = error.stack.match(/at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)/);
    if (matchResult) {
      filename = matchResult[2];
      line = parseInt(matchResult[3]);
      column = parseInt(matchResult[4]);
    }
  }
  return { filename, line, column };
};

const getErrorLines = (e: Event): [string, number, number] => {
  let filename = '';
  let line = -1;
  let column = -1;
  if (e instanceof ErrorEvent) {
    // JS Error
    line = e.lineno;
    column = e.colno;
  } else if (e instanceof PromiseRejectionEvent) {
    // Promise Rejection
    const reason = e.reason;
    if (reason instanceof Error && reason.stack) {
      // at myAsyncFunction (http://localhost:3000/cases/promise.ts?t=1733988430098:8:18)
      const info = getErrorStackInfo(reason);
      filename = info.filename;
      line = info.line;
      column = info.column;
    }
  } else if (isResourceElement(e.target)) {
    // Resource Error
  }
  return [filename, line, column];
};

const isResourceElement = (target: any) => {
  return (
    target instanceof HTMLScriptElement ||
    target instanceof HTMLImageElement ||
    target instanceof HTMLLinkElement
  );
};
