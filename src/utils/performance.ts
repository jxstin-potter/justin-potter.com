/**
 * Performance monitoring utilities
 * Tracks Web Vitals and error reporting
 */

import type { ErrorInfo } from "react";

export interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating?: "good" | "needs-improvement" | "poor";
}

// Web Vitals thresholds (in milliseconds or score)
const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 },
};

const devLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

const devError = (...args: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
};

// Determine rating for a metric
const getRating = (
  name: string,
  value: number,
): "good" | "needs-improvement" | "poor" => {
  const thresholds =
    WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS];
  if (!thresholds) return "good";

  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
};

// Web Vitals tracking
export const reportWebVital = (metric: WebVitalMetric) => {
  const rating = metric.rating || getRating(metric.name, metric.value);
  const metricData = {
    ...metric,
    rating,
    timestamp: Date.now(),
    url: window.location.href,
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    const emoji =
      rating === "good" ? "✅" : rating === "needs-improvement" ? "⚠️" : "❌";
    devLog(`${emoji} Web Vital [${rating.toUpperCase()}]:`, {
      name: metric.name,
      value: `${metric.value.toFixed(2)}${metric.name === "CLS" ? "" : "ms"}`,
      id: metric.id,
    });
  }

  // In production, send to analytics service
  // Example: sendToAnalytics(metricData);
  // You can integrate with Google Analytics, Vercel Analytics, or custom endpoint
  if (process.env.NODE_ENV === "production") {
    // Example: sendToAnalytics(metricData);
    // navigator.sendBeacon('/api/web-vitals', JSON.stringify(metricData));
    // Use metricData to avoid unused variable warning
    void metricData;
  }
};

// Error tracking
export const reportError = (error: Error, errorInfo?: ErrorInfo) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  devError("Error caught:", error, errorInfo);

  // In production, send to error tracking service (e.g., Sentry)
  // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  if (process.env.NODE_ENV === "production") {
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    // navigator.sendBeacon('/api/errors', JSON.stringify(errorData));
    // Use errorData to avoid unused variable warning
    void errorData;
  }
};

// Alias for ErrorBoundary compatibility
export const logError = reportError;

// Performance metrics
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof performance !== "undefined" && performance.mark) {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(name)[0];
    if (measure) {
      devLog(`${name} took ${measure.duration.toFixed(2)}ms`);
    }
  } else {
    fn();
  }
};

// Monitor bundle size
export const logBundleSize = () => {
  if (typeof window === "undefined" || !("performance" in window)) return;

  try {
    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      const transferSize = navigation.transferSize;
      const encodedSize = navigation.encodedBodySize;
      const decodedSize = navigation.decodedBodySize;

      const bundleInfo = {
        transfer: `${(transferSize / 1024).toFixed(2)} KB`,
        encoded: `${(encodedSize / 1024).toFixed(2)} KB`,
        decoded: `${(decodedSize / 1024).toFixed(2)} KB`,
        compressionRatio:
          transferSize > 0
            ? ((1 - encodedSize / transferSize) * 100).toFixed(1) + "%"
            : "N/A",
      };

      if (process.env.NODE_ENV === "development") {
        devLog("📦 Bundle size:", bundleInfo);
      }

      // Report TTFB (Time to First Byte)
      const ttfb = navigation.responseStart - navigation.requestStart;
      if (ttfb > 0) {
        reportWebVital({
          name: "TTFB",
          value: ttfb,
          id: "ttfb",
          delta: ttfb,
        });
      }
    }
  } catch (e) {
    // Performance API not fully supported
  }
};

// Track First Contentful Paint (FCP)
export const trackFCP = () => {
  if (typeof window === "undefined" || !("PerformanceObserver" in window))
    return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          reportWebVital({
            name: "FCP",
            value: entry.startTime,
            id: entry.name,
            delta: entry.startTime,
          });
          observer.disconnect();
        }
      }
    });

    observer.observe({ entryTypes: ["paint"] });
  } catch (e) {
    // Performance Observer not supported
  }
};

// Track Cumulative Layout Shift (CLS)
export const trackCLS = () => {
  if (typeof window === "undefined" || !("PerformanceObserver" in window))
    return;

  try {
    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Only count layout shifts without recent user input
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          clsEntries.push(entry);
        }
      }
    });

    observer.observe({ entryTypes: ["layout-shift"] });

    // Report CLS when page is hidden (user navigates away)
    const reportCLS = () => {
      if (clsValue > 0) {
        reportWebVital({
          name: "CLS",
          value: clsValue,
          id: "cls",
          delta: clsValue,
        });
      }
      observer.disconnect();
    };

    // Report CLS on visibility change or page unload
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        reportCLS();
      }
    });

    window.addEventListener("pagehide", reportCLS);
  } catch (e) {
    // Performance Observer not supported
  }
};

// Track Interaction to Next Paint (INP) - replaces FID
export const trackINP = () => {
  if (typeof window === "undefined" || !("PerformanceObserver" in window))
    return;

  try {
    let interactionEntries: PerformanceEventTiming[] = [];
    let maxDelay = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const eventEntry = entry as PerformanceEventTiming;
        // Track all interactions (click, keydown, pointerdown)
        if (eventEntry.duration > 0) {
          const delay = eventEntry.processingStart - eventEntry.startTime;
          interactionEntries.push(eventEntry);
          maxDelay = Math.max(maxDelay, delay);
        }
      }
    });

    observer.observe({ entryTypes: ["event"] });

    // Report INP when page is hidden
    const reportINP = () => {
      if (interactionEntries.length > 0) {
        // Calculate INP as the worst interaction delay
        // In production, you'd want to use the 98th percentile
        const inp = maxDelay;
        reportWebVital({
          name: "INP",
          value: inp,
          id: "inp",
          delta: inp,
        });
      }
      observer.disconnect();
    };

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        reportINP();
      }
    });

    window.addEventListener("pagehide", reportINP);
  } catch (e) {
    // Fallback to FID if INP not supported
    trackFID();
  }
};

// Track First Input Delay (FID) - fallback for older browsers
const trackFID = () => {
  if (typeof window === "undefined" || !("PerformanceObserver" in window))
    return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "first-input") {
          const firstInput = entry as PerformanceEventTiming & { id?: string };
          const fid = firstInput.processingStart - firstInput.startTime;
          reportWebVital({
            name: "FID",
            value: fid,
            id: firstInput.id || "fid",
            delta: fid,
          });
          observer.disconnect();
        }
      }
    });

    observer.observe({ entryTypes: ["first-input"] });
  } catch (e) {
    // Performance Observer not supported
  }
};
