import { LinkedList } from '../src';

describe('LinkedList', () => {
  it('should be able to add and remove nodes', () => {
    const list = new LinkedList<number>();
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);
    expect(list.getSize()).toBe(4);
    expect(list.toArray()).toEqual([1, 2, 3, 4]);
    const resultShift = list.shift();
    expect(resultShift).toBe(1);
    expect(list.getSize()).toBe(3);
    expect(list.toArray()).toEqual([2, 3, 4]);
    const resultPop = list.pop();
    expect(resultPop).toBe(4);
    expect(list.getSize()).toBe(2);
    expect(list.toArray()).toEqual([2, 3]);
    list.pop();
    list.pop();
    expect(list.getSize()).toBe(0);
    expect(list.toArray()).toEqual([]);
    list.push(4);
    expect(list.getSize()).toBe(1);
    expect(list.toArray()).toEqual([4]);
    list.shift();
    expect(list.getSize()).toBe(0);
    expect(list.toArray()).toEqual([]);
  });

  it('should return null when pop or shift an empty list', () => {
    const list = new LinkedList<number>();
    const resultPop = list.pop();
    expect(resultPop).toBeNull();
    const resultShift = list.shift();
    expect(resultShift).toBeNull();
    expect(list.toArray()).toEqual([]);
  });
});
