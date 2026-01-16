import { useState, useEffect } from 'react';

/**
 * Shared hook for managing current time display
 */
export const useDisplayTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return currentTime;
};
