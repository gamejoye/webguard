import { Guard as guard } from '@webguard/core';
import { setupErrorTests } from './error-test';
import { setupPromiseTests } from './promise-test';
import { setupBreadcrumbTests } from './breadcrumb-test';
import { setupSourceTests } from './source-test';
import { setupAsyncTests } from './async-test';
import { setupScriptErrorTests } from './script-error-test';
// 初始化各个测试用例
setupErrorTests(guard);
setupPromiseTests(guard);
setupBreadcrumbTests(guard);
setupSourceTests(guard);
setupAsyncTests(guard);
setupScriptErrorTests(guard);

guard.init({
  targetUrl: 'http://localhost:3001/data',
  breadcrumbConfig: {
    maxBreadcrumbs: 10,
    beforePushBreadcrumb: breadcrumb => {
      console.log('beforePushBreadcrumb:', breadcrumb);
      return breadcrumb;
    },
  },
});
