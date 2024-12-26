import type {
  CLSData,
  FCPData,
  FPData,
  IMonitorReporter,
  INPData,
  IPlugin,
  LCPData,
  PerformanceCallback,
  PerformancePluginConfig,
  PluginContext,
  TTFBData,
  UXPerformanceData,
  UxPerformanceRating,
  UxPerformanceTypes,
} from '@webguard/types';
import {
  onCLS,
  onINP,
  onFCP,
  onLCP,
  onTTFB,
  FCPThresholds,
  LCPThresholds,
  INPThresholds,
  CLSThresholds,
  TTFBThresholds,
} from 'web-vitals';
import Bowser from 'bowser';
import { getUserAgent } from '@webguard/utils';
import { WINDOW } from '@webguard/common';
import { UXPerformanceLog } from './models/log';

export function getUXPerformanceRating(
  type: UxPerformanceTypes,
  value: number
): UxPerformanceRating {
  const rating: UxPerformanceRating[] = ['good', 'normal'];
  let thresholds!: [number, number];
  switch (type) {
    case 'FP':
      thresholds = [1000, 2500];
      break;
    case 'FCP':
      thresholds = FCPThresholds;
      break;
    case 'LCP':
      thresholds = LCPThresholds;
      break;
    case 'INP':
      thresholds = INPThresholds;
      break;
    case 'CLS':
      thresholds = CLSThresholds;
      break;
    case 'TTFB':
      thresholds = TTFBThresholds;
      break;
    default:
      thresholds = [Number.MAX_VALUE, Number.MAX_VALUE];
      break;
  }
  for (let i = 0; i < 2; i++) {
    if (value < thresholds[i]) return rating[i];
  }
  return 'bad';
}

export class PerformancePlugin implements IPlugin {
  #name: string = 'Performance';
  #isSafari: boolean;
  #isFirefox: boolean;
  reporter!: IMonitorReporter;
  queue: UXPerformanceData[] = [];
  config: PerformancePluginConfig;

  /* eslint-disable @typescript-eslint/no-unused-vars */
  constructor(config: PerformancePluginConfig = {}) {
    const browser = Bowser.getParser(getUserAgent());
    this.#isSafari = browser.getBrowserName() === 'Safari';
    this.#isFirefox = browser.getBrowserName() === 'Firefox';
    this.config = config;
  }

  apply(context: PluginContext): void {
    this.reporter = context.reporter;
    WINDOW.document.onvisibilitychange = () => {
      if (WINDOW.document.visibilityState === 'hidden') {
        this.flushQueue();
      }
    };

    this.getFP(({ value }) => {
      if (this.config.onFP) this.config.onFP({ value });
      this.addToQueue({ name: 'FP', value, rating: getUXPerformanceRating('FP', value) });
    });
    this.getFCP(({ value }) => {
      if (this.config.onFCP) this.config.onFCP({ value });
      this.addToQueue({ name: 'FCP', value, rating: getUXPerformanceRating('FCP', value) });
    });
    this.getLCP(({ value }) => {
      if (this.config.onLCP) this.config.onLCP({ value });
      this.addToQueue({ name: 'LCP', value, rating: getUXPerformanceRating('LCP', value) });
    });
    this.getINP(({ value }) => {
      if (this.config.onINP) this.config.onINP({ value });
      this.addToQueue({ name: 'INP', value, rating: getUXPerformanceRating('INP', value) });
    });
    this.getCLS(({ value }) => {
      if (this.config.onCLS) this.config.onCLS({ value });
      this.addToQueue({ name: 'CLS', value, rating: getUXPerformanceRating('CLS', value) });
    });
    this.getTTFB(({ value }) => {
      if (this.config.onTTFB) this.config.onTTFB({ value });
      this.addToQueue({ name: 'TTFB', value, rating: getUXPerformanceRating('TTFB', value) });
    });
  }

  flushQueue() {
    if (!this.queue.length) return;
    const { reporter } = this;
    reporter.send(
      new UXPerformanceLog({
        uxPerformanceData: this.queue,
      })
    );
    this.queue = [];
  }

  addToQueue(data: UXPerformanceData): void {
    this.queue.push(data);
  }

  getFP(callback: PerformanceCallback<FPData>): void {
    const observer = new PerformanceObserver(list => {
      observer.disconnect();
      const entries = list.getEntries();
      // TODO safari 无法获取 first-paint
      const firstPaintEntry =
        entries.find(entry => 'first-paint' === entry.name) ||
        entries.find(entry => 'first-contentful-paint' === entry.name);
      callback({ value: firstPaintEntry ? firstPaintEntry.startTime : 0 });
    });

    observer.observe({ type: 'paint', buffered: true });
  }

  getFCP(callback: PerformanceCallback<FCPData>): void {
    if (!this.#isSafari && !this.#isFirefox) {
      onFCP(
        ({ value }) => {
          callback({ value });
        },
        { reportAllChanges: true }
      );
      return;
    }
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const firstContentfulPaintEntry = entries.find(
        entry => entry.name === 'first-contentful-paint'
      );
      callback({ value: firstContentfulPaintEntry ? firstContentfulPaintEntry.startTime : 0 });
      observer.disconnect();
    });
    observer.observe({ type: 'paint', buffered: true });
  }

  getLCP(callback: PerformanceCallback<LCPData>) {
    if (!this.#isSafari && !this.#isFirefox) {
      onLCP(
        ({ value }) => {
          callback({ value });
        },
        { reportAllChanges: true }
      );
      return;
    }
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const largestContentfulPaintEntry = entries.at(-1);
      callback({ value: largestContentfulPaintEntry ? largestContentfulPaintEntry.startTime : 0 });
      observer.disconnect();
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  getINP(callback: PerformanceCallback<INPData>) {
    if (!this.#isSafari && !this.#isFirefox) {
      onINP(
        ({ value }) => {
          callback({ value });
        },
        { reportAllChanges: true }
      );
      return;
    }
    // TODO polyfill INP
    callback({ value: 0 });
  }

  getCLS(callback: PerformanceCallback<CLSData>) {
    if (!this.#isSafari && !this.#isFirefox) {
      onCLS(
        ({ value }) => {
          callback({ value });
        },
        { reportAllChanges: true }
      );
      return;
    }
    const observer = new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      let firstLayoutShipft!: LayoutShift | null;
      let lastLayoutShift!: LayoutShift | null;
      let maxClsValue = 0;
      let curClsValue = 0;
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i] as LayoutShift;
        if (entry.hadRecentInput) continue;
        if (
          !lastLayoutShift ||
          (entry.startTime - lastLayoutShift.startTime < 1000 &&
            entry.startTime - firstLayoutShipft!.startTime < 5000)
        ) {
          if (!firstLayoutShipft) firstLayoutShipft = entry;
          lastLayoutShift = entry;
          curClsValue += entry.value;
        } else {
          firstLayoutShipft = lastLayoutShift = entry;
          curClsValue = entry.value;
        }
        maxClsValue = Math.max(maxClsValue, curClsValue);
      }

      observer.disconnect();
      callback({ value: maxClsValue });
    });
    // TODO safari 无法获取 layout-shift
    observer.observe({ type: 'layout-shift', buffered: true });
  }

  getTTFB(callback: PerformanceCallback<TTFBData>) {
    if (!this.#isSafari && !this.#isFirefox) {
      onTTFB(
        ({ value }) => {
          callback({ value });
        },
        { reportAllChanges: true }
      );
      return;
    }
    // TODO polyfill TTFB
    callback({ value: 0 });
  }

  get name() {
    return this.#name;
  }
}
