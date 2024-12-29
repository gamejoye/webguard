import { LogTypes, LogCategoies } from '@webguard/common';
import { IBaseLog } from '@webguard/types';
import { getUUID } from '@webguard/utils';

describe('uuid', () => {
  it('should be able to get uuid from log', () => {
    const log1: IBaseLog = {
      type: LogTypes.JS_ERROR,
      category: LogCategoies.ERROR_LOG,
      timestamp: 1234567890,
      pageUrl: 'https://example.com',
      userAgent:
        // eslint-disable-next-line max-len
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      sessionId: '1234567890',
      traceId: '1234567890',
    };
    const log2: IBaseLog = {
      type: LogTypes.PROMISE_REJECTION_ERROR,
      category: LogCategoies.ERROR_LOG,
      timestamp: 12345678910,
      pageUrl: 'https://example.com',
      userAgent:
        // eslint-disable-next-line max-len
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      sessionId: '1234567890',
      traceId: '1234567890',
    };
    const uuid1 = getUUID(log1);
    const uuid2 = getUUID(log2);
    expect(uuid1).toBe(getUUID(log1));
    expect(uuid2).toBe(getUUID(log2));
    expect(uuid1).not.toBe(uuid2);
  });

  it('should be exclude keys', () => {
    const obj1 = {
      name: 'obj',
      age: 20,
    };
    const obj2 = {
      name: 'obj',
      age: 40,
    };
    expect(getUUID(obj1)).not.toBe(getUUID(obj2));
    expect(getUUID(obj1, ['age'])).toBe(getUUID(obj2, ['age']));
  });
});
