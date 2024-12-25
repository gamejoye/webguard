import type {
  CLSData,
  FCPData,
  FPData,
  INPData,
  LCPData,
  PerformanceCallback,
  TTFBData,
} from '@webguard/types';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';
import Bowser from 'bowser';
import { getUserAgent } from '@webguard/utils';

export function getFP(callback: PerformanceCallback<FPData>): void {
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

export function getFCP(callback: PerformanceCallback<FCPData>): void {
  if (!isSafari && !isFirefox) {
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

export function getLCP(callback: PerformanceCallback<LCPData>) {
  if (!isSafari && !isFirefox) {
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

export function getINP(callback: PerformanceCallback<INPData>) {
  if (!isSafari && !isFirefox) {
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

export function getCLS(callback: PerformanceCallback<CLSData>) {
  if (!isSafari && !isFirefox) {
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

export function getTTFB(callback: PerformanceCallback<TTFBData>) {
  if (!isSafari && !isFirefox) {
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

const browser = Bowser.getParser(getUserAgent());
const isSafari = browser.getBrowserName() === 'Safari';
const isFirefox = browser.getBrowserName() === 'Firefox';
