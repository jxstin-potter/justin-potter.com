import { useCallback } from 'react';
import { DRAG_MULTIPLIER } from '../utils/constants';

export const useDragScroll = () => {
  // Optimized drag handler for project container - supports both mouse and touch
  const handleContainerMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    container.style.cursor = 'grabbing';
    let isDown = true;
    let startX = e.pageX - container.offsetLeft;
    let scrollLeft = container.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * DRAG_MULTIPLIER;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      isDown = false;
      container.style.cursor = 'grab';
      // Cleanup event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  // Touch handler for mobile swipe gestures
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    let startX = e.touches[0].pageX - container.offsetLeft;
    let scrollLeft = container.scrollLeft;
    let isDragging = true;

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * DRAG_MULTIPLIER;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
      isDragging = false;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, []);

  return {
    handleContainerMouseDown,
    handleTouchStart,
  };
};
