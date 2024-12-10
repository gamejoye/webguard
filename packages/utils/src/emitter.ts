type EventMap = {
  [k: string]: (...arg: any[]) => void;
}

type GetFunctionParams<T extends (...args: any) => void> = Parameters<T>;

export class EventEmitter<T extends EventMap> {
  protected eventStore = new Map<keyof T, Array<T[keyof T]>>();
  emit<E extends keyof T>(type: E, ...args: GetFunctionParams<T[E]>) {
    const handlers = this.eventStore.get(type) || [];
    for (const handler of handlers) handler(...args);
  }

  on<E extends keyof T>(type: E, handler: T[E]) {
    if (this.eventStore.has(type)) {
      this.eventStore.get(type)!.push(handler);
    } else {
      this.eventStore.set(type, [handler]);
    }
  }

  once<E extends keyof T>(type: E, handler: T[E]) {
    const newHandler = ((...args) => {
      this.off(type, newHandler);
      handler(...args);
    }) as T[E];
    this.on(type, newHandler);
  }

  off<E extends keyof T>(type: E, handler?: T[E]) {
    if (!this.eventStore.has(type)) return;
    if (handler === undefined) {
      this.eventStore.delete(type);
      return;
    }
    const index = this.eventStore.get(type)!.findIndex((hr) => hr === handler);
    if (index !== -1) this.eventStore.get(type)!.splice(index, 1);
  }
}