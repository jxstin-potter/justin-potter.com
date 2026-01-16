import { useState, useEffect, useRef } from 'react';

/**
 * Hook to throttle a value
 * @param value - The value to throttle
 * @param limit - Time limit in milliseconds (default: 1000ms)
 * @returns Throttled value
 */
export const useThrottle = <T>(value: T, limit: number = 1000): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};
