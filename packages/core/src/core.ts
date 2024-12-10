import { initFlags } from "@web-guard/utils";
import { initRelace } from "./replace";
import { reporter } from "./repoter";
import { breadcrumb } from "./breadcrumb";
import { WebGuardInitConfig } from "@web-guard/types";

export class WebGuard {
  config!: Required<WebGuardInitConfig>;
  init(config: WebGuardInitConfig) {
    this.config = {
      needCatchError: true,
      needCatchUnhandledrejection: true,
      monitorReporterConfig: {},
      breadcrumbConfig: {},
      ...config,
    };
    initFlags([
      ['onError', this.config.needCatchError],
      ['onUnHandledUnrejection', this.config.needCatchUnhandledrejection],
    ]);
    initRelace();
    reporter.bindConfig(this.config.monitorReporterConfig);
    breadcrumb.bindConfig(this.config.breadcrumbConfig);
  }
}

const guard = new WebGuard();
export { guard as Guard };