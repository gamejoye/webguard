import {
  getPageUrl,
  getUserAgent,
  stringifyTarget,
  isSameOrigin,
  EventEmitter,
  getFlag,
} from '@webguard/utils';
import { ErrorLog, Breadcrumb } from './models';
import { reporter } from './repoter';
import { breadcrumb } from './breadcrumb';
import { BreadcrumbLevel, BreadcrumbTypes, LogTypes } from '@webguard/common';
import { EventMaps, ExtraXMLHttpRequest, Flags, RouteData } from '@webguard/types';

export const handlersEmitter = new EventEmitter<EventMaps>();

export function subscribeEventWithFlags(type: Flags) {
  const isEnable = getFlag(type);
  if (!isEnable) return false;
  switch (type) {
    case 'onClick':
      handlersEmitter.on('CLICK', EventHandlers.handleClick);
      break;
    case 'onError':
      handlersEmitter.on('ERROR', EventHandlers.handleError);
      break;
    case 'onKeyDown':
      handlersEmitter.on('KEYDOWN', EventHandlers.handleKeyDown);
      break;
    case 'onKeyUp':
      handlersEmitter.on('KEYUP', EventHandlers.handleKeyUp);
      break;
    case 'onFetch':
      handlersEmitter.on('FETCH', EventHandlers.handleFetch);
      break;
    case 'onXHR':
      handlersEmitter.on('XHR', EventHandlers.handleXHR);
      break;
    case 'onRoute':
      handlersEmitter.on('ROUTE', EventHandlers.handleRoute);
      break;
    case 'onResourceError':
      handlersEmitter.on('RESOURCE_ERROR', EventHandlers.handleResourceError);
      break;
    case 'onUnHandledRejection':
      handlersEmitter.on('UNHANDLED_REJECTION', EventHandlers.handleUnHandledRejection);
      break;
    default:
      break;
  }
  return true;
}

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
  handleFetch(args: Parameters<typeof fetch>, res: Response | null, error: any) {
    let log: ErrorLog;
    const url =
      typeof args[0] === 'string'
        ? args[0]
        : Object.prototype.toString.call(args[0]) === '[object Request]'
          ? (args[0] as Request).url
          : (args[0] as URL).toString();
    const init = args[1];
    if (res) {
      const message = [
        `Failed to fetch ${url}`,
        `[status]: ${res.status}`,
        `[statusText]: ${res.statusText}`,
        `[method]: ${init?.method ?? 'GET'}`,
        `[body]: ${init?.body ?? ''}`,
        `[type]: ${res.type}`,
      ].join('\n');
      log = new ErrorLog({
        type: LogTypes.REQUEST_ERROR,
        pageUrl: getPageUrl(),
        userAgent: getUserAgent(),
        errorMessage: message,
      });
    } else {
      let filename = '';
      let line = -1;
      let column = -1;
      let message = `Failed to fetch ${url}`;
      if (error instanceof Error) {
        const info = getErrorStackInfo(error);
        filename = info.filename;
        line = info.line;
        column = info.column;
        message = error.message;
      }
      log = new ErrorLog({
        type: LogTypes.REQUEST_ERROR,
        pageUrl: getPageUrl(),
        userAgent: getUserAgent(),
        errorMessage: message,
        errorStack: getStackLines(error.stack),
        filename,
        line,
        column,
      });
    }
    reporter.send(log);
  },
  handleXHR(e: ProgressEvent<ExtraXMLHttpRequest>) {
    const { responseURL, requestURL, status, statusText, method, responseText } = e.target!;
    if (shouldSkipXhrHandler(e)) return;
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
  },
  handleRoute(data: RouteData) {
    const { from, to } = data;
    const message = `route from ${from} to ${to}`;
    const breadcrumbData = new Breadcrumb({
      type: BreadcrumbTypes.ROUTE,
      level: BreadcrumbLevel.INFO,
      message,
    });
    breadcrumb.push(breadcrumbData);
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

const shouldSkipXhrHandler = (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
  const status = (e.target as ExtraXMLHttpRequest).status;
  const type = e.type;
  // 正常情况 + 超时情况/错误情况 触发的loadend
  return (type === 'loadend' && status === 0) || (status + '').startsWith('2');
};
