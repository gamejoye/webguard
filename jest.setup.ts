class PromiseRejectionEventPolyfill extends Event {
  public readonly promise: Promise<any>;
  public readonly reason: any;

  public constructor(type: string, options: PromiseRejectionEventInit) {
    super(type);

    this.promise = options.promise;
    this.reason = options.reason;
  }
}
if (typeof PromiseRejectionEvent === 'undefined') {
  global.PromiseRejectionEvent = PromiseRejectionEventPolyfill;
}
