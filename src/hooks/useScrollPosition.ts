import { useState, useEffect } from 'react';

/**
 * Hook to track scroll position
 * @param element - The element to track scroll for (defaults to window)
 * @returns Current scroll position { x, y }
 */
export const useScrollPosition = (element?: HTMLElement | null) => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const target = element || window;
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        if (element) {
          setScrollPosition({
            x: element.scrollLeft,
            y: element.scrollTop,
          });
        } else {
          setScrollPosition({
            x: window.scrollX || window.pageXOffset,
            y: window.scrollY || window.pageYOffset,
          });
        }
        rafId = null;
      });
    };

    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      target.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [element]);

  return scrollPosition;
};
