import { LogCategoies, LogTypes } from '@webguard/common';
import { IBaseLog, IErrorLog, IUXPerformanceLog, UXPerformanceData } from '@webguard/types';

export class BaseLog implements IBaseLog {
  timestamp: number;
  category: LogCategoies;
  type: LogTypes;
  pageUrl: string;
  userAgent: string;
  sessionId: string;
  traceId?: string;

  constructor(options: Partial<IBaseLog> = {}) {
    this.timestamp = options.timestamp ?? Date.now();
    this.category = options.category ?? LogCategoies.ERROR_LOG;
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
    this.category = LogCategoies.ERROR_LOG;
    this.errorStack = options.errorStack ?? '';
    this.errorMessage = options.errorMessage ?? '';
    this.filename = options.filename ?? '';
    this.line = options.line ?? -1;
    this.column = options.column ?? -1;
  }
}

export class UXPerformanceLog extends BaseLog implements IUXPerformanceLog {
  uxPerformanceData: UXPerformanceData[];
  constructor(options: Partial<IUXPerformanceLog> = {}) {
    super(options);
    this.category = LogCategoies.UX_PERFORMANCE_LOG;
    this.uxPerformanceData = options.uxPerformanceData ?? [];
  }
}
