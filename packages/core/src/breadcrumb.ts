import { IBreadcrumbData, InitConfig } from '@webguard/types';
import { LinkedList } from '@webguard/utils';

export class Breadcrumb {
  maxBreadcrumbs!: number;
  beforePushBreadcrumb?: (breadcrumb: IBreadcrumbData) => IBreadcrumbData | null;
  stack: LinkedList<IBreadcrumbData>;
  constructor() {
    this.maxBreadcrumbs = 20;
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

  bindConfig(config: Required<InitConfig>): void {
    const { breadcrumbConfig } = config;
    if (breadcrumbConfig.maxBreadcrumbs !== undefined) {
      this.maxBreadcrumbs = breadcrumbConfig.maxBreadcrumbs;
    }
    if (breadcrumbConfig.beforePushBreadcrumb !== undefined) {
      this.beforePushBreadcrumb = breadcrumbConfig.beforePushBreadcrumb;
    }
  }
}

const breadcrumb = new Breadcrumb();
export { breadcrumb };
