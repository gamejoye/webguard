import { LogCategoies, LogTypes } from '@webguard/common';
import { ApiPerformanceData, IApiPerformanceLog } from '@webguard/types';

export class ApiPerformanceLog implements IApiPerformanceLog {
  totalRequests: number;
  successRequests: number;
  failedRequests: number;
  averaageTime: number;
  minTime: number;
  maxTime: number;
  apiPerformanceData: ApiPerformanceData[];

  timestamp: number;
  category: LogCategoies;
  type: LogTypes;
  pageUrl: string;
  userAgent: string;
  sessionId: string;
  traceId?: string;

  constructor(options: Partial<IApiPerformanceLog> = {}) {
    this.totalRequests = this.successRequests = this.failedRequests = this.averaageTime = 0;
    this.minTime = Number.MAX_VALUE;
    this.maxTime = 0;
    this.apiPerformanceData = options.apiPerformanceData ?? [];
    this.timestamp = options.timestamp ?? Date.now();
    this.category = LogCategoies.PERFORMANCE_LOG;
    this.type = LogTypes.API_PERFORMANCE;
    this.pageUrl = options.pageUrl ?? '';
    this.userAgent = options.userAgent ?? '';
    this.sessionId = options.sessionId ?? '';
    this.traceId = options.traceId ?? '';
  }

  addApiPerformanceData(data: ApiPerformanceData) {
    this.totalRequests++;
    const { time, status } = data;
    this.apiPerformanceData.push(data);
    if (status === 'success') {
      this.averaageTime =
        (this.averaageTime * this.successRequests + time) / (this.successRequests + 1);
      this.minTime = Math.min(this.minTime, time);
      this.maxTime = Math.max(this.maxTime, time);
      this.successRequests++;
    } else {
      this.failedRequests++;
    }
  }
}
