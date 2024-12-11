import { EventTypes } from '@web-guard/common';
import { EventMaps } from '@web-guard/types';
import { getFlag, isBrowerEnv, webGuardGlobal } from '@web-guard/utils';
import { EventHandlers } from './event-handlers';

export function initRelace() {
  addReplace('onError', e => EventHandlers.handleError(e));
  addReplace('onResourceError', e => EventHandlers.handleResourceError(e));
  addReplace('onUnHandledUnrejection', e => EventHandlers.handleUnHandledRejection(e));
  addReplace('onClick', e => EventHandlers.handleClick(e));
  addReplace('onKeyDown', e => EventHandlers.handleKeyDown(e));
  addReplace('onKeyUp', e => EventHandlers.handleKeyUp(e));
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
  }
}

function listenError(handler: EventMaps['onError']) {
  webGuardGlobal.addEventListener(EventTypes.ERROR, handler);
}

function listenResourceError(handler: EventMaps['onResourceError']) {
  /**
   * 监听资源加载错误
   * 资源加载错误不会冒泡，需要使用捕获阶段监听
   */
  webGuardGlobal.addEventListener(EventTypes.ERROR, handler, true);
}

function listenPromiseRejection(handler: EventMaps['onUnHandledUnrejection']) {
  webGuardGlobal.addEventListener(EventTypes.UNHANDLEDREJECTION, handler);
}

function listenClick(handler: EventMaps['onClick']) {
  if (!isBrowerEnv) return;
  document.addEventListener(EventTypes.CLICK, handler);
  // TODO: fill 重写 addEventListener
}

function listenKeyDown(handler: EventMaps['onKeyDown']) {
  if (!isBrowerEnv) return;
  document.addEventListener(EventTypes.KEYDOWN, handler);
  // TODO: fill 重写 addEventListener
}

function listenKeyUp(handler: EventMaps['onKeyUp']) {
  if (!isBrowerEnv) return;
  document.addEventListener(EventTypes.KEYUP, handler);
  // TODO: fill 重写 addEventListener
}
