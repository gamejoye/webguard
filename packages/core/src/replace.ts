import { EventTypes, WINDOW } from '@webguard/common';
import { ExtraXMLHttpRequest, Flags } from '@webguard/types';
import { fill, getPageUrl } from '@webguard/utils';
import { handlersEmitter, subscribeEventWithFlags } from './event-handlers';

export function initRelace() {
  addReplace('onError');
  addReplace('onResourceError');
  addReplace('onUnHandledRejection');
  addReplace('onClick');
  addReplace('onKeyDown');
  addReplace('onKeyUp');
  addReplace('onFetch');
  addReplace('onXHR');
  addReplace('onRoute');
}

function addReplace(type: Flags) {
  if (!subscribeEventWithFlags(type)) return;
  switch (type) {
    case 'onError':
      listenError();
      break;
    case 'onResourceError':
      listenResourceError();
      break;
    case 'onUnHandledRejection':
      listenPromiseRejection();
      break;
    case 'onClick':
      listenClick();
      break;
    case 'onKeyDown':
      listenKeyDown();
      break;
    case 'onKeyUp':
      listenKeyUp();
      break;
    case 'onFetch':
      replaceFetch();
      break;
    case 'onXHR':
      replaceXHR();
      break;
    case 'onRoute':
      replaceHistory();
  }
}

function listenError() {
  WINDOW.addEventListener(EventTypes.ERROR, function (e) {
    handlersEmitter.emit('ERROR', e);
  });
}

function listenResourceError() {
  /**
   * 监听资源加载错误
   * 资源加载错误不会冒泡，需要使用捕获阶段监听
   */
  WINDOW.addEventListener(
    EventTypes.ERROR,
    function (e) {
      handlersEmitter.emit('RESOURCE_ERROR', e);
    },
    true
  );
}

function listenPromiseRejection() {
  WINDOW.addEventListener(EventTypes.UNHANDLEDREJECTION, function (e) {
    handlersEmitter.emit('UNHANDLED_REJECTION', e);
  });
}

function listenClick() {
  WINDOW.document.addEventListener(EventTypes.CLICK, function (e) {
    handlersEmitter.emit('CLICK', e);
  });
}

function listenKeyDown() {
  WINDOW.document.addEventListener(EventTypes.KEYDOWN, function (e) {
    handlersEmitter.emit('KEYDOWN', e);
  });
}

function listenKeyUp() {
  WINDOW.document.addEventListener(EventTypes.KEYUP, function (e) {
    handlersEmitter.emit('KEYUP', e);
  });
}

function replaceFetch() {
  const originalFetch = WINDOW.fetch;
  if (!originalFetch) {
    console.warn('fetch is not supported');
    return;
  }
  fill(WINDOW, 'fetch', function fetchFactory(originalFetch) {
    return function fetch(...args: Parameters<typeof originalFetch>) {
      return originalFetch(...args)
        .then(res => {
          handlersEmitter.emit('FETCH', args, res, null);
          return res;
        })
        .catch(error => {
          handlersEmitter.emit('FETCH', args, null, error);
          throw error;
        });
    };
  });
}

function replaceXHR() {
  const originalXHR = WINDOW.XMLHttpRequest;
  if (!originalXHR) {
    console.warn('XMLHttpRequest is not supported');
    return;
  }
  fill(originalXHR.prototype, 'open', function openFactory(originalOpen) {
    return function open(
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
  fill(originalXHR.prototype, 'send', function sendFactory(originalSend) {
    return function send(this: ExtraXMLHttpRequest, ...args: Parameters<typeof originalSend>) {
      function handler(e: ProgressEvent<XMLHttpRequestEventTarget>) {
        handlersEmitter.emit('XHR', e as ProgressEvent<ExtraXMLHttpRequest>);
      }
      this.addEventListener('error', handler);
      this.addEventListener('loadend', handler);
      this.addEventListener('timeout', handler);
      return originalSend.apply(this, args);
    };
  });
}

function replaceHistory() {
  const originalHistory = WINDOW.history;
  if (!originalHistory) {
    console.warn('history is not supported');
    return;
  }
  let currentUrl = getPageUrl();
  fill(originalHistory, 'pushState', function pushStateFactory(originalPushState) {
    return function pushState(this: History, ...args: Parameters<typeof originalPushState>) {
      if (args[2]) {
        const to = args[2].toString();
        handlersEmitter.emit('ROUTE', { from: getPageUrl(), to });
        currentUrl = to;
      }
      return originalPushState.apply(this, args);
    };
  });
  fill(originalHistory, 'replaceState', function replaceStateFactory(originalReplaceState) {
    return function replaceState(this: History, ...args: Parameters<typeof originalReplaceState>) {
      if (args[2]) {
        const to = args[2].toString();
        handlersEmitter.emit('ROUTE', { from: getPageUrl(), to });
        currentUrl = to;
      }
      return originalReplaceState.apply(this, args);
    };
  });
  WINDOW.onpopstate = function () {
    const to = getPageUrl();
    handlersEmitter.emit('ROUTE', { from: currentUrl, to });
    currentUrl = to;
  };
  WINDOW.onhashchange = function (e) {
    const { oldURL: from, newURL: to } = e;
    handlersEmitter.emit('ROUTE', { from, to });
    currentUrl = to;
  };
}
