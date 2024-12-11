import { EventTypes } from '@web-guard/common';
import { EventMaps } from '@web-guard/types';
import { getFlag, isBrowerEnv, webGuardGlobal } from '@web-guard/utils';
import { EventHandlers } from './event-handlers';

export function initRelace() {
  addReplace('onError', e => EventHandlers.handleError(e));
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

function listenPromiseRejection(handler: EventMaps['onUnHandledUnrejection']) {
  webGuardGlobal.addEventListener(EventTypes.UNHANDLEDREJECTION, handler);
}

function listenClick(handler: EventMaps['onClick']) {
  if (!isBrowerEnv) return;
  document.addEventListener(EventTypes.CLICK, handler);
}

function listenKeyDown(handler: EventMaps['onKeyDown']) {
  if (!isBrowerEnv) return;
  document.addEventListener(EventTypes.KEYDOWN, handler);
}

function listenKeyUp(handler: EventMaps['onKeyUp']) {
  if (!isBrowerEnv) return;
  document.addEventListener(EventTypes.KEYUP, handler);
}
