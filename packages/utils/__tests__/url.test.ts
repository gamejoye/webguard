import { isSameOrigin } from '../src';

describe('url', () => {
  describe('isSameOrigin', () => {
    it('isSameOrigin when URL exists', () => {
      expect(isSameOrigin('https://example.com/abc/123/bjk', 'https://example.com/bcd')).toBe(true);
      expect(
        isSameOrigin('http://example.com/abc/123/bjk', 'https://example.com/abc/123/bjk')
      ).toBe(false);
      expect(isSameOrigin('https://bcd.com/abc/123/bjk', 'https://abc.com/abc/123/bjk/')).toBe(
        false
      );
      expect(isSameOrigin('unknown://abc.com', 'https://abc.com')).toBe(false);
      expect(isSameOrigin('unknown://abc.com', 'unknown://abc.com')).toBe(false);
    });

    it('isSameOrigin when URL does not exist', () => {
      const originalURL = window.URL;
      (window.URL as any) = undefined;
      expect(isSameOrigin('https://example.com/abc/123/bjk', 'https://example.com/bcd')).toBe(
        false
      );
      window.URL = originalURL;
    });
  });
});
