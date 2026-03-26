import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/common/ErrorBoundary";
import {
  reportWebVital,
  logBundleSize,
  trackFCP,
  trackCLS,
  trackINP,
  reportError,
} from "./utils/performance";

const devLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);

// Register service worker for PWA
if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        devLog("Service Worker registered:", registration);
      })
      .catch((error) => {
        devLog("Service Worker registration failed:", error);
      });
  });
}

// Initialize comprehensive Web Vitals tracking
if (typeof window !== "undefined" && "PerformanceObserver" in window) {
  try {
    // Track Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      // LCP is the last entry
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        reportWebVital({
          name: "LCP",
          value: lastEntry.startTime,
          id: "id" in lastEntry ? (lastEntry.id as string) || "lcp" : "lcp",
          delta: lastEntry.startTime,
        });
      }
    });

    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

    // Track First Contentful Paint (FCP)
    trackFCP();

    // Track Cumulative Layout Shift (CLS)
    trackCLS();

    // Track Interaction to Next Paint (INP) - modern replacement for FID
    trackINP();
  } catch (e) {
    // Performance Observer not fully supported
    console.warn("Web Vitals tracking not fully supported:", e);
  }
}

// Log bundle size and report TTFB on load
window.addEventListener("load", () => {
  setTimeout(() => {
    logBundleSize();
  }, 1000);
});

// Track unhandled errors globally
window.addEventListener("error", (event) => {
  const error = event.error || new Error(event.message);
  reportError(error);
});

// Track unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  const error =
    event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));
  reportError(error);
});
