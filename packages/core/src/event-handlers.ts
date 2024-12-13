import { getPageUrl, getUserAgent, stringifyTarget } from '@web-guard/utils';
import { ErrorLog, Breadcrumb } from './models';
import { reporter } from './repoter';
import { breadcrumb } from './breadcrumb';
import { BreadcrumbLevel, BreadcrumbTypes } from '@web-guard/common';

export const EventHandlers = {
  handleError(e: ErrorEvent): void {
    const log = new ErrorLog({
      pageUrl: getPageUrl(),
      userAgent: getUserAgent(),
      errorMessage: e.message,
      errorStack: typeof e.error?.stack === 'string' ? getLines(e.error.stack) : '',
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
      if (reason.stack) stack = getLines(reason.stack);
    }

    const log = new ErrorLog({
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
  fetchReplacer(originalFetch: typeof fetch) {
    return function (...args: Parameters<typeof fetch>) {
      return originalFetch(...args)
        .then(res => {
          if (!res.ok) {
            // 错误处理
          }
          return res;
        })
        .catch(error => {
          // 错误处理
          return error;
        });
    };
  },
  xhrReplacer(originalSend: typeof XMLHttpRequest.prototype.send) {
    return function (this: XMLHttpRequest, ...args: Parameters<typeof originalSend>) {
      this.addEventListener('error', function handleError(e) {
        console.log('error', e);
      });
      return originalSend.apply(this, args);
    };
  },
};

const getLines = (stack: string) => {
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
      const matchResult = reason.stack.match(/at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)/);
      if (matchResult) {
        filename = matchResult[2];
        line = parseInt(matchResult[3]);
        column = parseInt(matchResult[4]);
      }
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
