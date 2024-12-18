import { IErrorLog, MonitorReporterConfig } from '@webguard/types';
import { getUUIDFromLog } from '@webguard/utils';

export class MonitorReporter {
  repetitionErrorRemove: boolean; // 是否进行错误上报去重
  existLogUUIDs: Set<string>;

  constructor(config: MonitorReporterConfig = {}) {
    this.repetitionErrorRemove = config.repetitionErrorRemove || true;
    this.existLogUUIDs = new Set();
  }

  bindConfig(options: MonitorReporterConfig): void {
    if (options.repetitionErrorRemove !== undefined) {
      this.repetitionErrorRemove = options.repetitionErrorRemove;
    }
  }

  async send(log: IErrorLog): Promise<void> {
    if (!this.repetitionErrorRemove) {
      return this.immediateSend(log);
    }
    const uuid = getUUIDFromLog(log);
    if (this.existLogUUIDs.has(uuid)) return;
    this.existLogUUIDs.add(uuid);
    return this.immediateSend(log);
  }

  async immediateSend(log: IErrorLog): Promise<void> {
    console.log('log:', log);
    // TODO 上报
  }
}

const reporter = new MonitorReporter();
export { reporter };
