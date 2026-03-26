import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

/**
 * Hook to observe element intersection with viewport
 * @param options - IntersectionObserver options
 * @returns [ref, isIntersecting] - Ref to attach to element and intersection state
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {},
): [React.RefObject<HTMLElement | null>, boolean] => {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0%",
    triggerOnce = false,
  } = options;

  const elementRef = useRef<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const hasTriggered = useRef<boolean>(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If triggerOnce is true and we've already triggered, don't observe again
    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isCurrentlyIntersecting = entry.isIntersecting;

        setIsIntersecting(isCurrentlyIntersecting);

        if (triggerOnce && isCurrentlyIntersecting) {
          hasTriggered.current = true;
          observer.unobserve(element);
        }
      },
      { threshold, root, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  return [elementRef, isIntersecting];
};
