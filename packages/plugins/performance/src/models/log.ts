import { LogCategoies, LogTypes } from '@webguard/common';
import { IUXPerformanceLog, UXPerformanceData } from '@webguard/types';

export class UXPerformanceLog implements IUXPerformanceLog {
  uxPerformanceData: UXPerformanceData[];
  timestamp: number;
  category: LogCategoies;
  type: LogTypes;
  pageUrl: string;
  userAgent: string;
  sessionId: string;
  traceId?: string;

  constructor(options: Partial<IUXPerformanceLog> = {}) {
    this.timestamp = options.timestamp ?? Date.now();
    this.category = LogCategoies.UX_PERFORMANCE_LOG;
    this.type = LogTypes.UX_PERFORMANCE;
    this.pageUrl = options.pageUrl ?? '';
    this.userAgent = options.userAgent ?? '';
    this.sessionId = options.sessionId ?? '';
    this.traceId = options.traceId ?? '';
    this.uxPerformanceData = options.uxPerformanceData ?? [];
  }
}
