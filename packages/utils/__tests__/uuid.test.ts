import { LogTypes } from '@webguard/common';
import { IBaseLog } from '@webguard/types';
import { getUUIDFromLog } from '@webguard/utils';

describe('uuid', () => {
  it('should be able to get uuid from log', () => {
    const log1: IBaseLog = {
      type: LogTypes.JS_ERROR,
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
      timestamp: 12345678910,
      pageUrl: 'https://example.com',
      userAgent:
        // eslint-disable-next-line max-len
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      sessionId: '1234567890',
      traceId: '1234567890',
    };
    const uuid1 = getUUIDFromLog(log1);
    const uuid2 = getUUIDFromLog(log2);
    expect(uuid1).toBe(getUUIDFromLog(log1));
    expect(uuid2).toBe(getUUIDFromLog(log2));
    expect(uuid1).not.toBe(uuid2);
  });
});
