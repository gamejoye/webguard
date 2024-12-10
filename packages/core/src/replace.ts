import { EventTypes } from "@web-guard/common";
import { EventMaps } from "@web-guard/types";
import { getFlag, webGuardGlobal } from "@web-guard/utils";
import { EventHandlers } from "./event-handlers";

export function initRelace() {
  addReplace('onError', e => EventHandlers.handleError(e))
  addReplace('onUnHandledUnrejection', e => EventHandlers.handleUnHandledRejection(e))
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
  }
}

function listenError(handler: EventMaps['onError']) {
  webGuardGlobal.addEventListener(EventTypes.ERROR, handler)
}

function listenPromiseRejection(handler: EventMaps['onUnHandledUnrejection']) {
  webGuardGlobal.addEventListener(EventTypes.UNHANDLEDREJECTION, handler);
}

