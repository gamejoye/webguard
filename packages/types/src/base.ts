import { BreadcrumbLevel, BreadcrumbTypes, LogTypes, LogCategoies } from '@webguard/common';
import { GetFunctionParams } from './utils';

export interface IBaseLog {
  timestamp: number; // 日志产生的时间戳
  category: LogCategoies; // 日志大类
  type: LogTypes; // 日志类型具体细分
  pageUrl: string; // 页面 URL
  userAgent: string; // 用户的设备、浏览器信息
  sessionId: string; // 用户会话 ID
  traceId?: string; // 请求或操作的跟踪 ID，用于链路追踪
}

export interface IErrorLog extends IBaseLog {
  errorMessage: string; // 错误信息
  errorStack?: string; // 错误堆栈
  filename?: string; // 发生错误的文件名
  line?: number; // 错误发生的行号
  column?: number; // 错误发生的列号
}

export interface IUXPerformanceLog extends IBaseLog {
  uxPerformanceData: UXPerformanceData[]; // 用户体验数据
}

export interface IBreadcrumbData {
  type: BreadcrumbTypes;
  level: BreadcrumbLevel;
  message: string;
  timestamp: number;
  data: Record<string, any>;
}

export type BreadcrumbBeforePush = (breadcrumb: IBreadcrumbData) => IBreadcrumbData | null;

export type BreadcrumbConfig = {
  maxBreadcrumbs?: number;
  beforePushBreadcrumb?: BreadcrumbBeforePush;
};

export interface IMonitorReportData {
  log: IBaseLog | IErrorLog | IUXPerformanceLog;
  breadcrumbs: IBreadcrumbData[];
}

export type MonitorReporterBeforePost = (data: IMonitorReportData) => IMonitorReportData | null;

export type MonitorReporterConfig = {
  repetitionErrorRemove?: boolean; // 是否进行错误上报去重
  beforePost?: MonitorReporterBeforePost;
};

export type InitConfig = {
  targetUrl: string; // 错误上报服务器
  monitorReporterConfig?: MonitorReporterConfig; // 监控上报配置
  breadcrumbConfig?: BreadcrumbConfig; // 面包屑配置
};

export type ExtraXMLHttpRequest = XMLHttpRequest & {
  method: string;
  requestURL: string;
  url: string | URL;
};

export type RouteData = {
  from: string;
  to: string;
};

export type EventMaps = {
  ERROR: (e: ErrorEvent) => void;
  RESOURCE_ERROR: (e: Event) => void;
  UNHANDLED_REJECTION: (e: PromiseRejectionEvent) => void;
  CLICK: (e: MouseEvent) => void;
  KEYDOWN: (e: KeyboardEvent) => void;
  KEYUP: (e: KeyboardEvent) => void;
  FETCH: (args: Parameters<typeof fetch>, res: Response | null, error: any) => void;
  XHR: (e: ProgressEvent<ExtraXMLHttpRequest>) => void;
  ROUTE: (params: RouteData) => void;
};

export type Flags =
  | 'onError'
  | 'onResourceError'
  | 'onUnHandledRejection'
  | 'onClick'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onFetch'
  | 'onXHR'
  | 'onRoute';

export type UXPerformanceData = {
  name: string;
  value: number;
  rating: 'good' | 'normal' | 'bad';
};

export type FPData = {
  value: number;
};

export type FCPData = {
  value: number;
};

export type LCPData = {
  value: number;
};

export type CLSData = {
  value: number;
};

export type INPData = {
  value: number;
};

export type TTFBData = {
  value: number;
};

export type PerformanceCallback<
  T extends FPData | FCPData | LCPData | CLSData | INPData | TTFBData,
> = (data: T) => void;

export interface IEventEmitter<T extends { [k: string]: (...arg: any[]) => void }> {
  emit<E extends keyof T>(type: E, ...args: GetFunctionParams<T[E]>): void;
  on<E extends keyof T>(type: E, handler: T[E]): void;
  once<E extends keyof T>(type: E, handler: T[E]): void;
  off<E extends keyof T>(type: E, handler?: T[E]): void;
}
