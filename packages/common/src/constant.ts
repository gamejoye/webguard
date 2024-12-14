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
