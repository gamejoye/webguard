import { ErrorLog, ReporterData } from '../src/models';
import { MonitorReporter } from '../src/reporter';

describe('reporter', () => {
  it('reporter should skip duplicate logs', () => {
    const re = new MonitorReporter();
    const beaconSpy = jest.spyOn(re, 'beacon').mockImplementation(() => true);
    const targetUrl = 'http://localhost:3001/data';
    re.bindConfig({
      targetUrl,
      monitorReporterConfig: {
        repetitionErrorRemove: undefined,
        beforePost: undefined,
      },
      breadcrumbConfig: {
        maxBreadcrumbs: undefined,
        beforePushBreadcrumb: undefined,
      },
      plugins: [],
    });
    const errorLog1 = new ErrorLog();
    re.send(errorLog1);
    const errorLog2 = new ErrorLog();
    re.send(errorLog2);

    expect(beaconSpy).toHaveBeenCalledTimes(1);
    expect(beaconSpy).toHaveBeenNthCalledWith(
      1,
      targetUrl,
      expect.objectContaining<Partial<ReporterData>>({
        log: errorLog1,
      })
    );
  });

  it('reporter should not skip duplicate logs when repetitionErrorRemove is false', () => {
    const re = new MonitorReporter();
    const beaconSpy = jest.spyOn(re, 'beacon').mockImplementation(() => true);
    const targetUrl = 'http://localhost:3001/data';
    re.bindConfig({
      targetUrl,
      monitorReporterConfig: {
        repetitionErrorRemove: false,
        beforePost: undefined,
      },
      breadcrumbConfig: {
        maxBreadcrumbs: undefined,
        beforePushBreadcrumb: undefined,
      },
      plugins: [],
    });
    const errorLog1 = new ErrorLog();
    re.send(errorLog1);
    const errorLog2 = new ErrorLog();
    re.send(errorLog2);

    expect(beaconSpy).toHaveBeenCalledTimes(2);
    expect(beaconSpy).toHaveBeenNthCalledWith(
      1,
      targetUrl,
      expect.objectContaining<Partial<ReporterData>>({
        log: errorLog1,
      })
    );
    expect(beaconSpy).toHaveBeenNthCalledWith(
      2,
      targetUrl,
      expect.objectContaining<Partial<ReporterData>>({
        log: errorLog2,
      })
    );
  });

  it('reporter should not send when targetUrl is empty', () => {
    const re = new MonitorReporter();
    const beaconSpy = jest.spyOn(re, 'beacon').mockImplementation(() => true);
    const targetUrl = '  ';
    re.bindConfig({
      targetUrl,
      monitorReporterConfig: {
        repetitionErrorRemove: undefined,
        beforePost: undefined,
      },
      breadcrumbConfig: {
        maxBreadcrumbs: undefined,
        beforePushBreadcrumb: undefined,
      },
      plugins: [],
    });
    const errorLog = new ErrorLog();
    re.send(errorLog);
    expect(beaconSpy).toHaveBeenCalledTimes(0);
  });

  it('beforePost hook should work', () => {
    const re = new MonitorReporter();
    const beaconSpy = jest.spyOn(re, 'beacon').mockImplementation(() => true);
    const targetUrl = 'http://localhost:3001/data';
    const errorLog = new ErrorLog();
    const errorLogShouldBeenSkip = new ErrorLog({
      traceId: 'skip',
    });
    const beforePost = jest.fn().mockImplementation((data: ReporterData) => {
      return data.log.traceId === 'skip' ? null : data;
    });
    re.bindConfig({
      targetUrl,
      monitorReporterConfig: {
        repetitionErrorRemove: undefined,
        beforePost,
      },
      breadcrumbConfig: {
        maxBreadcrumbs: undefined,
        beforePushBreadcrumb: undefined,
      },
      plugins: [],
    });
    re.send(errorLog);
    re.send(errorLogShouldBeenSkip);

    expect(beaconSpy).toHaveBeenCalledTimes(1);
    expect(beaconSpy).toHaveBeenNthCalledWith(
      1,
      targetUrl,
      expect.objectContaining<Partial<ReporterData>>({
        log: errorLog,
      })
    );
  });

  it('xhrPost should been called when beacon failed', () => {
    const re = new MonitorReporter();
    const beaconSpy = jest.spyOn(re, 'beacon').mockImplementation(() => false);
    const xhrPostSpy = jest.spyOn(re, 'xhrPost').mockImplementation(async () => {});
    const targetUrl = 'http://localhost:3001/data';
    const errorLog = new ErrorLog();
    re.bindConfig({
      targetUrl,
      monitorReporterConfig: {
        repetitionErrorRemove: undefined,
        beforePost: undefined,
      },
      breadcrumbConfig: {
        maxBreadcrumbs: undefined,
        beforePushBreadcrumb: undefined,
      },
      plugins: [],
    });
    re.send(errorLog);
    expect(beaconSpy).toHaveBeenCalledTimes(1);
    expect(beaconSpy).toHaveBeenNthCalledWith(
      1,
      targetUrl,
      expect.objectContaining<Partial<ReporterData>>({
        log: errorLog,
      })
    );
    expect(xhrPostSpy).toHaveBeenCalledTimes(1);
    expect(xhrPostSpy).toHaveBeenNthCalledWith(
      1,
      targetUrl,
      expect.objectContaining<Partial<ReporterData>>({
        log: errorLog,
      })
    );
  });
});
