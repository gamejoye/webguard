import { EventEmitter } from '../src';

type Events = {
  test1: () => void;
  test2: () => void;
  test3: () => void;
  testWithParams: (a: number, b: string) => void;
};

describe('Emitter', () => {
  it('should emit events', () => {
    const mockFn = jest.fn();
    const mockOnceFn = jest.fn();
    const mockNoCallbackFn = jest.fn();
    const emitter = new EventEmitter<Events>();
    emitter.on('test1', mockFn);
    emitter.once('test2', mockOnceFn);
    emitter.on('test3', mockNoCallbackFn);
    emitter.emit('test1');
    emitter.emit('test1');
    emitter.emit('test2');
    emitter.emit('test2');
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockOnceFn).toHaveBeenCalledTimes(1);
    expect(mockNoCallbackFn).toHaveBeenCalledTimes(0);
  });

  it('should remove event listener', () => {
    const mockFn = jest.fn();
    const emitter = new EventEmitter<Events>();
    emitter.on('test1', mockFn);
    emitter.emit('test1');
    emitter.off('test1', mockFn);
    emitter.emit('test1');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should remove all event listeners', () => {
    const mockFn = jest.fn();
    const mockFn2 = jest.fn();
    const emitter = new EventEmitter<Events>();
    emitter.on('test1', mockFn);
    emitter.on('test1', mockFn2);
    emitter.emit('test1');
    emitter.off('test1');
    emitter.off('test1');
    emitter.emit('test1');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  it('should emit events with params', () => {
    const mockFn = jest.fn();
    const emitter = new EventEmitter<Events>();
    emitter.on('testWithParams', mockFn);
    const params: Parameters<Events['testWithParams']> = [1, 'test'];
    emitter.emit('testWithParams', ...params);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(...params);
  });

  it('should emit all event listeners', () => {
    const mockFn = jest.fn();
    const mockFn2 = jest.fn();
    const emitter = new EventEmitter<Events>();
    emitter.on('test1', mockFn);
    emitter.on('test1', mockFn2);
    emitter.emit('test1');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });
});
