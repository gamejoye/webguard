import { Guard as guard } from '@web-guard/core';
import { setupErrorTests } from './cases/error';
import { setupPromiseTests } from './cases/promise';
import { setupBreadcrumbTests } from './cases/breadcrumb';
import { setupSourceTests } from './cases/source';
import { setupAsyncTests } from './cases/async';
import { setupScriptErrorTests } from './cases/script-error';
// 初始化各个测试用例
setupErrorTests(guard);
setupPromiseTests(guard);
setupBreadcrumbTests(guard);
setupSourceTests(guard);
setupAsyncTests(guard);
setupScriptErrorTests(guard);

guard.init({
  targetUrl: 'testurl',
  breadcrumbConfig: {
    maxBreadcrumbs: 10,
    beforePushBreadcrumb: breadcrumb => {
      console.log('beforePushBreadcrumb:', breadcrumb);
      return breadcrumb;
    },
  },
});
