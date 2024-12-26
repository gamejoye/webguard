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
      plugins: [],
      ...config,
    };
    initFlags([
      ['onError', true],
      ['onResourceError', true],
      ['onUnHandledRejection', true],
      ['onClick', true],
      ['onKeyDown', true],
      ['onKeyUp', true],
      ['onFetch', true],
      ['onXHR', true],
      ['onRoute', true],
    ]);
    initRelace();
    reporter.bindConfig(this.config);
    breadcrumb.bindConfig(this.config);

    this.config.plugins.forEach(plugin => {
      plugin.apply({
        ...this.config,
        on: () => {},
        once: () => {},
        emit: () => {},
        reporter,
        breadcrumb,
      });
    });
  }
}

const guard = new WebGuard();
export { guard as Guard };
