import { useState, useEffect } from 'react';
import { WELCOME_SCRAMBLE_DELAY, WELCOME_TRANSITION_DELAY } from '../utils/constants';

interface UseWelcomeTransitionReturn {
  targetNameParts: [string, string];
  welcomeTransitionComplete: boolean;
  setTargetNameParts: (parts: [string, string]) => void;
}

export const useWelcomeTransition = (
  showWelcome: boolean,
  shouldScrambleFromWelcome: boolean
): UseWelcomeTransitionReturn => {
  // Track the target name parts for smooth transitions
  // Start with "WELCOME" if welcome is showing, otherwise "JUSTIN"
  const [targetNameParts, setTargetNameParts] = useState<[string, string]>(
    showWelcome ? ['WELCOME', ''] : ['JUSTIN', 'POTTER']
  );
  
  // Track if welcome transition has completed - after this, use two-part system for project hovers
  const [welcomeTransitionComplete, setWelcomeTransitionComplete] = useState<boolean>(!showWelcome);
  
  // Trigger scramble from WELCOME to JUSTIN when shouldScrambleFromWelcome becomes true
  useEffect(() => {
    if (shouldScrambleFromWelcome && !welcomeTransitionComplete) {
      // Small delay to ensure component is mounted, then scramble to JUSTIN
      // The ScrambleText component handles the animation from WELCOME to JUSTIN
      // After animation completes, transition to the two-part system
      const timer = setTimeout(() => {
        // Mark transition as complete after animation duration (500ms) + small buffer
        setTimeout(() => {
          setWelcomeTransitionComplete(true);
          // After JUSTIN appears, transition to JUSTIN POTTER (two-part system)
          setTargetNameParts(['JUSTIN', 'POTTER']);
        }, WELCOME_TRANSITION_DELAY);
      }, WELCOME_SCRAMBLE_DELAY);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [shouldScrambleFromWelcome, welcomeTransitionComplete]);
  
  // Update targetNameParts when showWelcome changes
  useEffect(() => {
    if (showWelcome && !shouldScrambleFromWelcome) {
      // Welcome is showing but not yet scrambling - show WELCOME
      setTargetNameParts(['WELCOME', '']);
      setWelcomeTransitionComplete(false);
    }
    if (!showWelcome && !welcomeTransitionComplete) {
      // If welcome is dismissed early, force completion state
      setWelcomeTransitionComplete(true);
      setTargetNameParts(['JUSTIN', 'POTTER']);
    }
  }, [showWelcome, shouldScrambleFromWelcome, welcomeTransitionComplete]);

  return {
    targetNameParts,
    welcomeTransitionComplete,
    setTargetNameParts,
  };
};
