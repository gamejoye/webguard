import { stringifyTarget } from '@web-guard/utils';

describe('stringifyTarget', () => {
  it('should be able to stringify target', () => {
    const divElement = document.createElement('div');
    divElement.textContent = 'Hello world';
    expect(stringifyTarget({ target: divElement })).toBe('<div>Hello world</div>');

    expect(stringifyTarget({ target: 'Hello world' })).toBe('Hello world');
    expect(stringifyTarget({ target: 123 })).toBe('123');
    expect(stringifyTarget({ target: {} })).toBe('[object Object]');
  });
});
