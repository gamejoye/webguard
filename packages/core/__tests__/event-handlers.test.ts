import { getPageUrl, setFlag } from '@webguard/utils';
import { handlersEmitter, subscribeEventWithFlags, EventHandlers } from '../src/event-handlers';
import { reporter } from '../src/repoter';
import { breadcrumb } from '../src/breadcrumb';
import { BreadcrumbLevel, BreadcrumbTypes, LogTypes } from '@webguard/common';
import { ExtraXMLHttpRequest, IBreadcrumbData } from '@webguard/types';
import { ErrorLog } from '../src/models';

describe('event-handlers', () => {
  describe('subscribeEventWithFlags', () => {
    beforeEach(() => {
      setFlag('onClick', false);
      setFlag('onError', false);
      setFlag('onFetch', false);
      setFlag('onKeyDown', false);
      setFlag('onKeyUp', false);
      setFlag('onResourceError', false);
      setFlag('onRoute', false);
      setFlag('onUnHandledRejection', false);
      setFlag('onXHR', false);
      handlersEmitter.off('CLICK');
      handlersEmitter.off('ERROR');
      handlersEmitter.off('FETCH');
      handlersEmitter.off('KEYDOWN');
      handlersEmitter.off('KEYUP');
      handlersEmitter.off('RESOURCE_ERROR');
      handlersEmitter.off('ROUTE');
      handlersEmitter.off('UNHANDLED_REJECTION');
      handlersEmitter.off('XHR');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('subscribeEventWithFlags should work', () => {
      setFlag('onClick', true);
      const spyHandleClick = jest.spyOn(EventHandlers, 'handleClick').mockImplementation(() => {});
      const spyHandleKeyDown = jest
        .spyOn(EventHandlers, 'handleKeyDown')
        .mockImplementation(() => {});
      subscribeEventWithFlags('onClick');
      const e: any = {};
      handlersEmitter.emit('CLICK', e);
      expect(spyHandleClick).toHaveBeenCalledTimes(1);
      expect(spyHandleClick).toHaveBeenCalledWith(e);
      expect(spyHandleKeyDown).toHaveBeenCalledTimes(0);
    });
    it('subscribeEventWithFlag[onClick] should work', () => {
      setFlag('onClick', true);
      const spyHandleClick = jest.spyOn(EventHandlers, 'handleClick').mockImplementation(() => {});
      subscribeEventWithFlags('onClick');
      const e: any = {};
      handlersEmitter.emit('CLICK', e);
      expect(spyHandleClick).toHaveBeenCalledTimes(1);
      expect(spyHandleClick).toHaveBeenCalledWith(e);
    });

    it('subscribeEventWithFlag[onError] should work', () => {
      setFlag('onError', true);
      const spyHandleError = jest.spyOn(EventHandlers, 'handleError').mockImplementation(() => {});
      subscribeEventWithFlags('onError');
      const e: any = {};
      handlersEmitter.emit('ERROR', e);
      expect(spyHandleError).toHaveBeenCalledTimes(1);
      expect(spyHandleError).toHaveBeenCalledWith(e);
    });

    it('subscribeEventWithFlag[onFetch] should work', () => {
      setFlag('onFetch', true);
      const spyHandleFetch = jest.spyOn(EventHandlers, 'handleFetch').mockImplementation(() => {});
      subscribeEventWithFlags('onFetch');
      const error = new Error();
      handlersEmitter.emit('FETCH', ['url'], null, error);
      expect(spyHandleFetch).toHaveBeenCalledTimes(1);
      expect(spyHandleFetch).toHaveBeenCalledWith(['url'], null, error);
    });

    it('subscribeEventWithFlag[onKeyDown] should work', () => {
      setFlag('onKeyDown', true);
      const spyHandleKeyDown = jest
        .spyOn(EventHandlers, 'handleKeyDown')
        .mockImplementation(() => {});
      subscribeEventWithFlags('onKeyDown');
      const e: any = {};
      handlersEmitter.emit('KEYDOWN', e);
      expect(spyHandleKeyDown).toHaveBeenCalledTimes(1);
      expect(spyHandleKeyDown).toHaveBeenCalledWith(e);
    });

    it('subscribeEventWithFlag[onKeyUp] should work', () => {
      setFlag('onKeyUp', true);
      const spyHandleKeyUp = jest.spyOn(EventHandlers, 'handleKeyUp').mockImplementation(() => {});
      subscribeEventWithFlags('onKeyUp');
      const e: any = {};
      handlersEmitter.emit('KEYUP', e);
      expect(spyHandleKeyUp).toHaveBeenCalledTimes(1);
      expect(spyHandleKeyUp).toHaveBeenCalledWith(e);
    });

    it('subscribeEventWithFlag[onResourceError] should work', () => {
      setFlag('onResourceError', true);
      const spyHandleResourceError = jest
        .spyOn(EventHandlers, 'handleResourceError')
        .mockImplementation(() => {});
      subscribeEventWithFlags('onResourceError');
      const e: any = {};
      handlersEmitter.emit('RESOURCE_ERROR', e);
      expect(spyHandleResourceError).toHaveBeenCalledTimes(1);
      expect(spyHandleResourceError).toHaveBeenCalledWith(e);
    });

    it('subscribeEventWithFlag[onRoute] should work', () => {
      setFlag('onRoute', true);
      const spyHandleRoute = jest.spyOn(EventHandlers, 'handleRoute').mockImplementation(() => {});
      subscribeEventWithFlags('onRoute');
      const e: any = {};
      handlersEmitter.emit('ROUTE', e);
      expect(spyHandleRoute).toHaveBeenCalledTimes(1);
      expect(spyHandleRoute).toHaveBeenCalledWith(e);
    });

    it('subscribeEventWithFlag[onUnHandledRejection] should work', () => {
      setFlag('onUnHandledRejection', true);
      const spyHandleUnHandledRejection = jest
        .spyOn(EventHandlers, 'handleUnHandledRejection')
        .mockImplementation(() => {});
      subscribeEventWithFlags('onUnHandledRejection');
      const e: any = {};
      handlersEmitter.emit('UNHANDLED_REJECTION', e);
      expect(spyHandleUnHandledRejection).toHaveBeenCalledTimes(1);
      expect(spyHandleUnHandledRejection).toHaveBeenCalledWith(e);
    });

    it('subscribeEventWithFlag[onXHR] should work', () => {
      setFlag('onXHR', true);
      const spyHandleXHR = jest.spyOn(EventHandlers, 'handleXHR').mockImplementation(() => {});
      subscribeEventWithFlags('onXHR');
      const e: any = {};
      handlersEmitter.emit('XHR', e);
      expect(spyHandleXHR).toHaveBeenCalledTimes(1);
      expect(spyHandleXHR).toHaveBeenCalledWith(e);
    });
  });

  describe('EventHandlers', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('handleClick should work', () => {
      const spyPush = jest.spyOn(breadcrumb, 'push').mockImplementation(val => val);
      const e = new MouseEvent('click', {});
      EventHandlers.handleClick(e);
      expect(spyPush).toHaveBeenCalledTimes(1);
      expect(spyPush).toHaveBeenCalledWith(
        expect.objectContaining<Partial<IBreadcrumbData>>({
          type: BreadcrumbTypes.CLICK,
          level: BreadcrumbLevel.INFO,
        })
      );
    });
    it('handleError should work', () => {
      const spySend = jest.spyOn(reporter, 'send').mockImplementation(async () => {});
      let e = new ErrorEvent('click', { colno: 0, lineno: 0 });
      EventHandlers.handleError(e);
      expect(spySend).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: LogTypes.CROSSORIGIN_SCRIPT_ERROR,
        })
      );

      e = new ErrorEvent('click', { colno: 1, lineno: 12, filename: getPageUrl() });
      EventHandlers.handleError(e);
      expect(spySend).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: LogTypes.JS_ERROR,
        })
      );
    });
    it('handleFetch should work', () => {
      const spySend = jest.spyOn(reporter, 'send').mockImplementation(async () => {});
      const error = new Error();
      const URL = 'https://www.google.com/';
      EventHandlers.handleFetch([URL], null, error);
      expect(spySend).toHaveBeenCalledTimes(1);
      expect(spySend).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: LogTypes.REQUEST_ERROR,
        })
      );
      const calls = spySend.mock.calls;
      const firstCall = calls[0][0] as ErrorLog;
      expect(firstCall.column).not.toBe(-1);

      EventHandlers.handleFetch([URL], {} as any, null);
      expect(spySend).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: LogTypes.REQUEST_ERROR,
        })
      );
      const secondCall = calls[1][0] as ErrorLog;
      expect(secondCall.errorMessage).toMatch(URL);
    });
    it('handleKeyDown should work', () => {
      const spyPush = jest.spyOn(breadcrumb, 'push').mockImplementation(val => val);
      const key = 'Enter';
      const e = new KeyboardEvent('keydown', { key });
      EventHandlers.handleKeyDown(e);
      expect(spyPush).toHaveBeenCalledTimes(1);
      expect(spyPush).toHaveBeenCalledWith(
        expect.objectContaining<Partial<IBreadcrumbData>>({
          type: BreadcrumbTypes.KEYBOARD,
          level: BreadcrumbLevel.INFO,
          message: expect.stringMatching(key),
        })
      );
    });
    it('handleKeyUp should work', () => {
      const spyPush = jest.spyOn(breadcrumb, 'push').mockImplementation(val => val);
      const key = 'Enter';
      const e = new KeyboardEvent('keyup', { key });
      EventHandlers.handleKeyUp(e);
      expect(spyPush).toHaveBeenCalledTimes(1);
      expect(spyPush).toHaveBeenCalledWith(
        expect.objectContaining<Partial<IBreadcrumbData>>({
          type: BreadcrumbTypes.KEYBOARD,
          level: BreadcrumbLevel.INFO,
          message: expect.stringMatching(key),
        })
      );
    });
    it('handleResourceError should work', () => {
      const spySend = jest.spyOn(reporter, 'send').mockImplementation(async () => {});
      const imgElement = document.createElement('img');
      imgElement.src = 'https://example.com/non-existent-image.jpg';
      const e = { ...new Event('error'), target: imgElement };
      EventHandlers.handleResourceError(e);
      expect(spySend).toHaveBeenCalledTimes(1);
      expect(spySend).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: LogTypes.RESOURCE_ERROR,
        })
      );
      const { errorMessage } = spySend.mock.calls[0][0] as ErrorLog;
      expect(errorMessage).toMatch('img');
      expect(errorMessage).toMatch('https://example.com/non-existent-image.jpg');
    });

    it('handleRoute', () => {
      const spyPush = jest.spyOn(breadcrumb, 'push').mockImplementation(val => val);
      const from = 'https://example.com/bcd';
      const to = 'https://example.com/abc';
      EventHandlers.handleRoute({ from, to });
      expect(spyPush).toHaveBeenCalledTimes(1);
      expect(spyPush).toHaveBeenCalledWith(
        expect.objectContaining<Partial<IBreadcrumbData>>({
          type: BreadcrumbTypes.ROUTE,
          level: BreadcrumbLevel.INFO,
        })
      );
      const { message } = spyPush.mock.calls[0][0];
      expect(message).toMatch(from);
      expect(message).toMatch(to);
    });

    it('handleUnHandledRejection', () => {
      const spySend = jest.spyOn(reporter, 'send').mockImplementation(async () => {});
      const e = new PromiseRejectionEvent('unhandledrejection', {
        promise: new Promise(() => {}),
        reason: new Error(),
      });
      EventHandlers.handleUnHandledRejection(e);
      expect(spySend).toHaveBeenCalledTimes(1);
      expect(spySend).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: LogTypes.PROMISE_REJECTION_ERROR,
        })
      );
      const { column, line } = spySend.mock.calls[0][0] as ErrorLog;
      expect(column).toBeGreaterThan(0);
      expect(line).toBeGreaterThan(0);
    });

    it('handleXHR', () => {
      const req = new XMLHttpRequest() as ExtraXMLHttpRequest;
      req.method = 'GET';
      req.requestURL = getPageUrl();
      req.url = getPageUrl();
      const spySend = jest.spyOn(reporter, 'send').mockImplementation(async () => {});
      const e = { ...new ProgressEvent('error'), target: req };
      EventHandlers.handleXHR(e);
      expect(spySend).toHaveBeenCalledTimes(1);
      expect(spySend).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining<Partial<ErrorLog>>({
          type: LogTypes.REQUEST_ERROR,
          errorMessage: expect.stringMatching('GET'),
        })
      );
    });
  });
});
