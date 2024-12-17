import { getPageUrl, getUserAgent } from '../src';

describe('getPageUrl', () => {
  it('should return the pageUrl', () => {
    expect(getPageUrl()).toBeTruthy();
  });
});

describe('getUserAgent', () => {
  it('should return the userAgent', () => {
    expect(getUserAgent()).toBeTruthy();
  });
});
