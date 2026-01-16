import { useState, useEffect } from 'react';

/**
 * Hook to track media query matches
 * @param query - Media query string (e.g., '(min-width: 768px)')
 * @returns Boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Update state if initial value differs
    if (mediaQuery.matches !== matches) {
      setMatches(mediaQuery.matches);
    }

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers support addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query, matches]);

  return matches;
};
