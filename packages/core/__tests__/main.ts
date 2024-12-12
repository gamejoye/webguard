import { Guard as guard } from '@web-guard/core';
import { setupErrorTests } from './cases/error';
import { setupPromiseTests } from './cases/promise';
import { setupBreadcrumbTests } from './cases/breadcrumb';
import { setupSourceTests } from './cases/source';

// 初始化各个测试用例
setupErrorTests(guard);
setupPromiseTests(guard);
setupBreadcrumbTests(guard);
setupSourceTests(guard);

guard.init({
  targetUrl: 'testurl',
  breadcrumbConfig: {
    maxBreadcrumbs: 10,
    beforePushBreadcrumb: breadcrumb => {
      console.log('Breadcrumb:', breadcrumb);
      return breadcrumb;
    },
  },
});
