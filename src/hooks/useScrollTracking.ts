import { useState, useEffect, RefObject } from "react";

export const useScrollTracking = (
  sectionRef: RefObject<HTMLElement | null>,
): boolean => {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    // Find the scrollable main element (motion.main from App.tsx)
    const findScrollableMain = (): HTMLElement | null => {
      // Try to find the main element that contains this section
      const section = sectionRef.current;
      if (!section) return null;

      let current: HTMLElement | null = section.parentElement;
      while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        const tagName = current.tagName.toLowerCase();
        // Look for main element with overflowY: auto
        if (
          tagName === "main" &&
          (style.overflowY === "auto" || style.overflowY === "scroll")
        ) {
          return current;
        }
        current = current.parentElement;
      }
      return null;
    };

    const setupScrollListener = () => {
      const scrollableMain = findScrollableMain();
      if (!scrollableMain) return null;

      const handleScroll = () => {
        const scrollTop = scrollableMain.scrollTop || 0;
        const scrollHeight = scrollableMain.scrollHeight || 0;
        const clientHeight = scrollableMain.clientHeight || 0;
        const maxScroll = scrollHeight - clientHeight;
        // Show footer when scrolled at least 20px OR when near bottom (within 30px of max scroll, but only if maxScroll is significant)
        const threshold = 20;
        const nearBottomThreshold = 30;
        // Only check near bottom if there's enough scrollable content and we're actually near the bottom
        const nearBottom =
          maxScroll > nearBottomThreshold &&
          scrollTop >= maxScroll - nearBottomThreshold;
        const pastThreshold = scrollTop >= threshold;
        const shouldShow = pastThreshold || nearBottom;
        setShowFooter(shouldShow);
      };

      // Check initial scroll position - should be 0, so footer should be hidden
      handleScroll();

      scrollableMain.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      return () => scrollableMain.removeEventListener("scroll", handleScroll);
    };

    // Retry with delay to ensure DOM is ready
    let cleanup: (() => void) | undefined = undefined;
    const timeoutId = setTimeout(() => {
      cleanup = setupScrollListener() || undefined;
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cleanup?.();
    };
  }, [sectionRef]);

  return showFooter;
};
