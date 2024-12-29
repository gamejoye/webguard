import { BreadcrumbTypes } from '@webguard/common';
import { Breadcrumb } from '../src/breadcrumb';
import { Breadcrumb as BreadcrumbData } from '../src/models';

describe('breadcrumb', () => {
  it('should be able to push breadcrumb', () => {
    const breadcrumb = new Breadcrumb();
    const MAX_BREADCRUMBS = 20;
    breadcrumb.bindConfig({
      breadcrumbConfig: {
        maxBreadcrumbs: MAX_BREADCRUMBS,
      },
      targetUrl: '',
      monitorReporterConfig: {
        beforePost: undefined,
      },
      plugins: [],
    });

    for (let i = 0; i < MAX_BREADCRUMBS - 1; i++) {
      breadcrumb.push(new BreadcrumbData({}));
    }
    expect(breadcrumb.stack.getSize()).toBe(MAX_BREADCRUMBS - 1);
    breadcrumb.push(new BreadcrumbData({}));
    expect(breadcrumb.stack.getSize()).toBe(MAX_BREADCRUMBS);

    breadcrumb.push(new BreadcrumbData({}));
    expect(breadcrumb.stack.getSize()).toBe(MAX_BREADCRUMBS);

    breadcrumb.clear();
    expect(breadcrumb.stack.getSize()).toBe(0);
  });

  it('should be able to config beforePushBreadcrumb', () => {
    const clickBreadcrumbData = new BreadcrumbData({ type: BreadcrumbTypes.CLICK });
    const keyboardBreadcrumbData = new BreadcrumbData({ type: BreadcrumbTypes.KEYBOARD });

    const breadcrumb = new Breadcrumb();
    const MAX_BREADCRUMBS = 20;
    breadcrumb.bindConfig({
      breadcrumbConfig: {
        maxBreadcrumbs: MAX_BREADCRUMBS,
        beforePushBreadcrumb: data => {
          return data.type === BreadcrumbTypes.CLICK ? null : data;
        },
      },
      targetUrl: '',
      monitorReporterConfig: {
        beforePost: undefined,
      },
      plugins: [],
    });

    breadcrumb.push(clickBreadcrumbData);
    breadcrumb.push(keyboardBreadcrumbData);
    expect(breadcrumb.getStack()).toEqual([keyboardBreadcrumbData]);
  });
});
