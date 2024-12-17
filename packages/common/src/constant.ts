export enum LogTypes {
  JS_ERROR = 'js_error',
  PROMISE_REJECTION_ERROR = 'promise_rejection_error',
  RESOURCE_ERROR = 'resource_error',
  REQUEST_ERROR = 'request_error',
  CROSSORIGIN_SCRIPT_ERROR = 'crossorigin_script_error',
}

export enum EventTypes {
  ERROR = 'error',
  UNHANDLEDREJECTION = 'unhandledrejection',
  CLICK = 'click',
  KEYDOWN = 'keydown',
  KEYUP = 'keyup',
}

export enum BreadcrumbTypes {
  HTTP = 'http',
  CLICK = 'click',
  KEYBOARD = 'keyboard',
  ROUTE = 'route',
  CONSOLE = 'console',
  CODE_ERROR = 'code_error',
  CUSTOM = 'custom',
}

export enum BreadcrumbLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

// TODO: 需要处理非浏览器环境 降级处理
export const WINDOW = (__MODE__ === 'web' ? window : {}) as typeof window;
