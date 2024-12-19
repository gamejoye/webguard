import { IMonitorReportData, WithRequired } from '@webguard/types';
import { BaseLog, ErrorLog } from './log';
import { Breadcrumb } from './breadcrumb';
export class ReporterData implements IMonitorReportData {
  log: ErrorLog | BaseLog;
  breadcrumbs: Breadcrumb[];
  constructor(options: WithRequired<Partial<IMonitorReportData>, 'log' | 'breadcrumbs'>) {
    this.log = options.log;
    this.breadcrumbs = options.breadcrumbs;
  }
}
