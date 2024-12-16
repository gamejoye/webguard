import { EventTypes, WINDOW } from '@web-guard/common';
import { EventMaps } from '@web-guard/types';
import { getFlag } from '@web-guard/utils';
import { EventHandlers } from './event-handlers';

export function initRelace() {
  addReplace('onError', e => EventHandlers.handleError(e));
  addReplace('onResourceError', e => EventHandlers.handleResourceError(e));
  addReplace('onUnHandledUnrejection', e => EventHandlers.handleUnHandledRejection(e));
  addReplace('onClick', e => EventHandlers.handleClick(e));
  addReplace('onKeyDown', e => EventHandlers.handleKeyDown(e));
  addReplace('onKeyUp', e => EventHandlers.handleKeyUp(e));
  addReplace('onFetch', EventHandlers.fetchReplacer);
  addReplace('onXHR', EventHandlers.xhrReplacer);
}

function addReplace<T extends keyof EventMaps>(type: T, handler: EventMaps[T]) {
  if (!getFlag(type)) return;
  switch (type) {
    case 'onError':
      listenError(handler as EventMaps['onError']);
      break;
    case 'onResourceError':
      listenResourceError(handler as EventMaps['onResourceError']);
      break;
    case 'onUnHandledUnrejection':
      listenPromiseRejection(handler as EventMaps['onUnHandledUnrejection']);
      break;
    case 'onClick':
      listenClick(handler as EventMaps['onClick']);
      break;
    case 'onKeyDown':
      listenKeyDown(handler as EventMaps['onKeyDown']);
      break;
    case 'onKeyUp':
      listenKeyUp(handler as EventMaps['onKeyUp']);
      break;
    case 'onFetch':
      replaceFetch(handler as EventMaps['onFetch']);
      break;
    case 'onXHR':
      replaceXHR(handler as EventMaps['onXHR']);
      break;
  }
}

function listenError(handler: EventMaps['onError']) {
  WINDOW.addEventListener(EventTypes.ERROR, handler);
}

function listenResourceError(handler: EventMaps['onResourceError']) {
  /**
   * 监听资源加载错误
   * 资源加载错误不会冒泡，需要使用捕获阶段监听
   */
  WINDOW.addEventListener(EventTypes.ERROR, handler, true);
}

function listenPromiseRejection(handler: EventMaps['onUnHandledUnrejection']) {
  WINDOW.addEventListener(EventTypes.UNHANDLEDREJECTION, handler);
}

function listenClick(handler: EventMaps['onClick']) {
  WINDOW.document.addEventListener(EventTypes.CLICK, handler);
  // TODO: fill 重写 addEventListener
}

function listenKeyDown(handler: EventMaps['onKeyDown']) {
  WINDOW.document.addEventListener(EventTypes.KEYDOWN, handler);
  // TODO: fill 重写 addEventListener
}

function listenKeyUp(handler: EventMaps['onKeyUp']) {
  WINDOW.document.addEventListener(EventTypes.KEYUP, handler);
  // TODO: fill 重写 addEventListener
}

function replaceFetch(replacer: EventMaps['onFetch']) {
  const originalFetch = WINDOW.fetch;
  if (!originalFetch) {
    console.warn('fetch is not supported');
    return;
  }
  WINDOW.fetch = replacer(originalFetch);
}

function replaceXHR(replacer: EventMaps['onXHR']) {
  const originalXHR = WINDOW.XMLHttpRequest;
  if (!originalXHR) {
    console.warn('XMLHttpRequest is not supported');
    return;
  }
  replacer(originalXHR);
}
