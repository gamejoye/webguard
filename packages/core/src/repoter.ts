import { InitConfig, MonitorReporterBeforePost } from '@webguard/types';
import { getUUIDFromLog } from '@webguard/utils';
import { breadcrumb } from './breadcrumb';
import { ErrorLog, ReporterData } from './models';
import { WINDOW } from '@webguard/common';

const isEmpty = (url: string) => url.trim() === '';

export class MonitorReporter {
  targetUrl: string;
  repetitionErrorRemove: boolean; // 是否进行错误上报去重
  existLogUUIDs: Set<string>;
  beforePost?: MonitorReporterBeforePost;

  constructor() {
    this.repetitionErrorRemove = true;
    this.existLogUUIDs = new Set();
    this.targetUrl = '';
  }

  bindConfig(config: Required<InitConfig>): void {
    const { targetUrl, monitorReporterConfig } = config;
    this.targetUrl = targetUrl;
    if (monitorReporterConfig.repetitionErrorRemove !== undefined) {
      this.repetitionErrorRemove = monitorReporterConfig.repetitionErrorRemove;
    }
    if (monitorReporterConfig.beforePost !== undefined) {
      this.beforePost = monitorReporterConfig.beforePost;
    }
  }

  async send(log: ErrorLog): Promise<void> {
    if (!this.repetitionErrorRemove) {
      return this.immediateSend(log);
    }
    const uuid = getUUIDFromLog(log);
    if (this.existLogUUIDs.has(uuid)) return;
    this.existLogUUIDs.add(uuid);
    return this.immediateSend(log);
  }

  beacon(url: string, data: ReporterData): boolean {
    if (!WINDOW.navigator.sendBeacon) {
      return false;
    }
    return WINDOW.navigator.sendBeacon(url, JSON.stringify(data));
  }

  async xhrPost(url: string, data: ReporterData) {
    if (!WINDOW.XMLHttpRequest) {
      return;
    }
    const xhr = new WINDOW.XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  }

  async immediateSend(log: ErrorLog): Promise<void> {
    if (isEmpty(this.targetUrl)) {
      console.warn('webguard: targetUrl为空，请在init中配置targetUrl！');
      return;
    }
    const breadcrumbs = breadcrumb.getStack();
    let data: ReporterData | null = new ReporterData({
      log,
      breadcrumbs,
    });
    if (this.beforePost) {
      data = this.beforePost(data);
    }
    if (!data) return;
    const beaconSuccess = this.beacon(this.targetUrl, data);
    if (!beaconSuccess) {
      console.log('beacon failed');
      return this.xhrPost(this.targetUrl, data);
    }
  }
}

const reporter = new MonitorReporter();
export { reporter };
