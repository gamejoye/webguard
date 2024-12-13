import { BreadcrumbTypes, BreadcrumbLevel } from '@web-guard/common';
import { IBreadcrumbData } from '@web-guard/types';

export class Breadcrumb implements IBreadcrumbData {
  type: BreadcrumbTypes;
  level: BreadcrumbLevel;
  message: string;
  timestamp: number;
  data: Record<string, any>;
  constructor(partial: Partial<IBreadcrumbData>) {
    this.type = partial.type || BreadcrumbTypes.CUSTOM;
    this.level = partial.level || BreadcrumbLevel.INFO;
    this.message = partial.message || '';
    this.timestamp = partial.timestamp || Date.now();
    this.data = partial.data || {};
  }
}
