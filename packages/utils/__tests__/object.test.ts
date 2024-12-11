import { fill } from '../src';

describe('object', () => {
  describe('fill', () => {
    it('should be able to fill object property', () => {
      const obj = {
        test: 'init test',
      };
      fill(obj, 'test', () => 'filled test');
      expect(obj.test).toBe('filled test');
    });

    it('should be able to fill object property with prototype', () => {
      const prototype = {};
      const valueWithPrototype = {
        test: {},
      };
      Object.setPrototypeOf(valueWithPrototype.test, prototype);
      const wrapperTest = fill(valueWithPrototype, 'test', () => ({}));
      expect(wrapperTest).toBe(valueWithPrototype.test);
      expect(Object.getPrototypeOf(wrapperTest)).toBe(prototype);
    });
  });
});
