import { initFlags } from '@webguard/utils';
import { initRelace } from './replace';
import { reporter } from './repoter';
import { breadcrumb } from './breadcrumb';
import { InitConfig } from '@webguard/types';

export class WebGuard {
  config!: Required<InitConfig>;
  init(config: InitConfig) {
    this.config = {
      monitorReporterConfig: {},
      breadcrumbConfig: {},
      ...config,
    };
    initFlags([
      ['onError', true],
      ['onResourceError', true],
      ['onUnHandledUnrejection', true],
      ['onClick', true],
      ['onKeyDown', true],
      ['onKeyUp', true],
      ['onFetch', true],
      ['onXHR', true],
    ]);
    initRelace();
    reporter.bindConfig(this.config);
    breadcrumb.bindConfig(this.config);
  }
}

const guard = new WebGuard();
export { guard as Guard };
