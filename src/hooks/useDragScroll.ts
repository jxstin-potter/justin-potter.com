import { useCallback } from "react";
import { DRAG_MULTIPLIER } from "../utils/constants";

export const useDragScroll = () => {
  // Optimized drag handler for project container - supports both mouse and touch
  const handleContainerMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      container.style.cursor = "grabbing";
      let isDown = true;
      const startX = e.pageX - container.offsetLeft;
      const initialScrollLeft = container.scrollLeft;
      let rafId: number | null = null;
      let pendingWalk = 0;

      const applyScroll = () => {
        container.scrollLeft = initialScrollLeft - pendingWalk;
        rafId = null;
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        pendingWalk = (x - startX) * DRAG_MULTIPLIER;
        if (rafId === null) {
          rafId = requestAnimationFrame(applyScroll);
        }
      };

      const handleMouseUp = () => {
        isDown = false;
        container.style.cursor = "grab";
        // Cleanup event listeners
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [],
  );

  // Touch handler for mobile swipe gestures
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const startX = e.touches[0].pageX - container.offsetLeft;
      const startY = e.touches[0].pageY;
      const initialScrollLeft = container.scrollLeft;
      let isDragging = true;
      let isHorizontalDrag: boolean | null = null;
      let rafId: number | null = null;
      let pendingWalk = 0;

      const applyScroll = () => {
        container.scrollLeft = initialScrollLeft - pendingWalk;
        rafId = null;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const deltaX = touch.pageX - startX;
        const deltaY = touch.pageY - startY;

        // Lock gesture direction once movement is clear.
        if (isHorizontalDrag === null) {
          const movementThreshold = 4;
          if (
            Math.abs(deltaX) < movementThreshold &&
            Math.abs(deltaY) < movementThreshold
          ) {
            return;
          }
          isHorizontalDrag = Math.abs(deltaX) > Math.abs(deltaY);
        }

        if (!isHorizontalDrag) {
          return;
        }

        e.preventDefault();
        const x = touch.pageX - container.offsetLeft;
        pendingWalk = (x - startX) * DRAG_MULTIPLIER;
        if (rafId === null) {
          rafId = requestAnimationFrame(applyScroll);
        }
      };

      const handleTouchEnd = () => {
        isDragging = false;
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        document.removeEventListener("touchcancel", handleTouchEnd);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
      document.addEventListener("touchcancel", handleTouchEnd);
    },
    [],
  );

  return {
    handleContainerMouseDown,
    handleTouchStart,
  };
};
