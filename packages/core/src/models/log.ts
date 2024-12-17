import { LogTypes } from '@web-guard/common';
import { IBaseLog, IErrorLog } from '@web-guard/types';

export class BaseLog implements IBaseLog {
  timestamp: number;
  type: LogTypes;
  pageUrl: string;
  userAgent: string;
  sessionId: string;
  traceId?: string;

  constructor(options: Partial<IBaseLog> = {}) {
    this.timestamp = options.timestamp ?? Date.now();
    this.type = options.type ?? LogTypes.JS_ERROR;
    this.pageUrl = options.pageUrl ?? '';
    this.userAgent = options.userAgent ?? '';
    this.sessionId = options.sessionId ?? '';
    this.traceId = options.traceId ?? '';
  }
}

export class ErrorLog extends BaseLog implements IErrorLog {
  errorMessage: string;
  errorStack?: string;
  filename?: string;
  line?: number;
  column?: number;

  constructor(options: Partial<IErrorLog> = {}) {
    super(options);
    this.errorStack = options.errorStack ?? '';
    this.errorMessage = options.errorMessage ?? '';
    this.filename = options.filename ?? '';
    this.line = options.line ?? -1;
    this.column = options.column ?? -1;
  }
}
