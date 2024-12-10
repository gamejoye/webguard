import { BreadcrumbConfig, IBreadcrumbData } from '@web-guard/types';
import { LinkedList } from '@web-guard/utils';

export class Breadcrumb {
  maxBreadcrumbs!: number;
  beforePushBreadcrumb?: (breadcrumb: IBreadcrumbData) => IBreadcrumbData | null;
  stack: LinkedList<IBreadcrumbData>;
  constructor(config: BreadcrumbConfig = {}) {
    this.bindConfig(config);
    this.stack = new LinkedList<IBreadcrumbData>();
  }

  push(breadcrumb: IBreadcrumbData): IBreadcrumbData | null {
    if (this.beforePushBreadcrumb) {
      const result = this.beforePushBreadcrumb(breadcrumb);
      if (!result) {
        return null;
      }
      breadcrumb = result;
    }
    if (this.stack.getSize() >= this.maxBreadcrumbs) {
      this.stack.shift();
    }
    this.stack.push(breadcrumb);
    return breadcrumb;
  }

  clear(): void {
    while (this.stack.getSize()) this.stack.shift();
  }

  getStack(): IBreadcrumbData[] {
    return this.stack.toArray();
  }

  bindConfig(config: BreadcrumbConfig): void {
    this.maxBreadcrumbs = config.maxBreadcrumbs ?? 30;
    this.beforePushBreadcrumb = config.beforePushBreadcrumb;
  }
}

const breadcrumb = new Breadcrumb();
export { breadcrumb };
