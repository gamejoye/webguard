import { BreadcrumbLevel, BreadcrumbTypes, LogTypes, LogCategoies } from '@webguard/common';
import { GetFunctionParams } from './utils';

export interface IMonitorReporter {
  bindConfig(config: Required<InitConfig>): void;
  send(log: IBaseLog): Promise<void>;
}

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

export interface IApiPerformanceLog extends IBaseLog {
  totalRequests: number;
  successRequests: number;
  failedRequests: number;
  averaageTime: number;
  minTime: number;
  maxTime: number;
  apiPerformanceData: ApiPerformanceData[];
}

export type ApiPerformanceData = {
  url: string;
  method: string;
  body?: string;
  status: 'success' | 'failed';
  time: number;
};

export interface IBreadcrumb {
  push(breadcrumb: IBreadcrumbData): IBreadcrumbData | null;
  clear(): void;
  getStack(): IBreadcrumbData[];
  bindConfig(config: Required<InitConfig>): void;
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
  plugins?: IPlugin[];
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

export type UxPerformanceTypes = 'FP' | 'FCP' | 'LCP' | 'CLS' | 'INP' | 'TTFB';
export type UxPerformanceRating = 'good' | 'normal' | 'bad';

export type UXPerformanceData = {
  name: UxPerformanceTypes;
  value: number;
  rating: UxPerformanceRating;
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

export type PluginContext = Omit<IEventEmitter<EventMaps>, 'off'> &
  InitConfig & {
    breadcrumb: IBreadcrumb;
    reporter: IMonitorReporter;
  };

export interface IPlugin {
  name: string;
  apply(context: PluginContext): void;
}

export type PerformancePluginConfig = {
  onFP?: PerformanceCallback<FPData>;
  onFCP?: PerformanceCallback<FCPData>;
  onLCP?: PerformanceCallback<LCPData>;
  onINP?: PerformanceCallback<INPData>;
  onCLS?: PerformanceCallback<CLSData>;
  onTTFB?: PerformanceCallback<TTFBData>;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ApiPerformancePluginConfig = {};
