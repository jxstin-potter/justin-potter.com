import React, { useState, useEffect, useRef, useCallback, memo } from "react";

interface ScrambleTextProps {
  /** Current text to display */
  text: string;
  /** Target text to scramble to (if different from text) */
  targetText?: string;
  /** Whether the scramble animation should be active */
  isHovered?: boolean;
  /** Duration of scramble animation in milliseconds */
  scrambleDuration?: number;
  /** Number of iterations per letter */
  iterations?: number;
  /** Character set for scrambling */
  scrambleChars?: string;
  /** Additional className */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
  /** Whether to preserve spaces */
  preserveSpaces?: boolean;
  /** Whether to preserve special characters */
  preserveSpecialChars?: boolean;
  /** Retrigger key - when this changes, force animation retrigger even if targetText is same */
  retriggerKey?: number;
}

/**
 * ScrambleText component - Clean implementation
 * Uses state for displayText and properly guards against effect interference
 */
const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  targetText,
  isHovered = false,
  scrambleDuration = 200,
  iterations = 5,
  scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  className = "",
  style = {},
  preserveSpaces = true,
  preserveSpecialChars = true,
  retriggerKey = 0,
}) => {
  const actualTarget = targetText !== undefined ? targetText : text;
  // State for displayed text - always starts with base text
  const [displayText, setDisplayText] = useState<string>(text);

  // Refs to track animation state
  const intervalRef = useRef<number | null>(null);
  const isAnimatingRef = useRef<boolean>(false);
  const targetRef = useRef<string>(actualTarget);
  const lastActualTargetRef = useRef<string>(actualTarget);
  const previousTargetTextRef = useRef<string | undefined>(targetText); // Track targetText prop changes
  const lastRetriggerKeyRef = useRef<number>(retriggerKey); // Track retriggerKey changes

  // Scramble animation function - use ref to access current displayText without dependency
  const displayTextRef = useRef<string>(text);

  // Keep ref in sync with state - CRITICAL: this must always reflect current display
  useEffect(() => {
    displayTextRef.current = displayText;
  }, [displayText]);

  // Track when actualTarget changes to prevent unnecessary effect runs
  useEffect(() => {
    lastActualTargetRef.current = actualTarget;
  }, [actualTarget]);

  // Helper functions
  const getRandomChar = useCallback((): string => {
    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  }, [scrambleChars]);

  const shouldPreserve = useCallback(
    (char: string): boolean => {
      if (preserveSpaces && char === " ") return true;
      if (preserveSpecialChars && /[^A-Za-z0-9\s]/.test(char)) return true;
      return false;
    },
    [preserveSpaces, preserveSpecialChars],
  );

  const startScramble = useCallback(
    (from: string, to: string) => {
      // Clear any existing animation
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
        intervalRef.current = null;
      }

      // Set refs immediately to prevent race conditions
      isAnimatingRef.current = true;
      targetRef.current = to;

      const fromChars = from.split("");
      const toChars = to.split("");
      const maxLength = Math.max(fromChars.length, toChars.length);
      const frameTime = scrambleDuration / iterations;
      let iteration = 0;
      let lastFrameTime = performance.now();

      const animate = (currentTime: number) => {
        // Check if this animation was cancelled (target changed)
        if (targetRef.current !== to) {
          isAnimatingRef.current = false;
          intervalRef.current = null;
          return;
        }

        // Throttle to frameTime
        if (currentTime - lastFrameTime < frameTime) {
          intervalRef.current = requestAnimationFrame(animate);
          return;
        }
        lastFrameTime = currentTime;

        if (iteration >= iterations) {
          // Animation complete
          setDisplayText(to);
          displayTextRef.current = to;
          isAnimatingRef.current = false;
          intervalRef.current = null;
          return;
        }

        // Generate scrambled text
        const scrambled = Array.from({ length: maxLength }, (_, i) => {
          const toChar = toChars[i] || "";

          if (shouldPreserve(toChar)) {
            return toChar;
          }

          const progress = iteration / iterations;
          if (progress > 0.7) {
            return Math.random() > 0.3 ? toChar : getRandomChar();
          }

          return getRandomChar();
        }).join("");

        setDisplayText(scrambled);
        displayTextRef.current = scrambled;
        iteration++;

        // Continue animation
        intervalRef.current = requestAnimationFrame(animate);
      };

      // Start animation with requestAnimationFrame
      intervalRef.current = requestAnimationFrame(animate);
    },
    [scrambleDuration, iterations, getRandomChar, shouldPreserve],
  );

  // Handle targetText changes (for project name transitions)
  // CRITICAL: Only run when actualTarget actually changes, not on every render
  useEffect(() => {
    // Check retriggerKey changes - this forces retrigger even when target is same
    const retriggerKeyChanged = lastRetriggerKeyRef.current !== retriggerKey;
    if (retriggerKeyChanged) {
      lastRetriggerKeyRef.current = retriggerKey;
    }

    // If retriggerKey changed, force animation even if target is same
    if (retriggerKeyChanged && actualTarget !== "" && !isAnimatingRef.current) {
      const currentFrom = displayTextRef.current;
      startScramble(currentFrom, actualTarget);
      return;
    }

    // Skip if target hasn't actually changed and retriggerKey hasn't changed
    if (lastActualTargetRef.current === actualTarget && !retriggerKeyChanged) {
      return;
    }

    // Update last target immediately to prevent duplicate runs
    lastActualTargetRef.current = actualTarget;

    // Skip if currently animating to the same target (unless retriggerKey changed)
    if (
      isAnimatingRef.current &&
      targetRef.current === actualTarget &&
      !retriggerKeyChanged
    ) {
      return;
    }

    // Skip if display already matches target and not animating (unless retriggerKey changed)
    if (
      !isAnimatingRef.current &&
      displayTextRef.current === actualTarget &&
      !retriggerKeyChanged
    ) {
      targetRef.current = actualTarget;
      return;
    }

    // Start new animation - always use current display as starting point for seamless transitions
    // This ensures smooth transitions when switching between projects
    const currentFrom = displayTextRef.current;
    startScramble(currentFrom, actualTarget);
    // actualTarget is derived from targetText, so we don't need targetText in deps
    // text is the base text and shouldn't trigger re-runs when it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualTarget, startScramble, retriggerKey]);

  // Handle hover state (for logo, nav items, and project name transitions)
  // When isHovered is true, scramble to targetText (which may differ from text)
  // When isHovered is false, scramble back to base text
  useEffect(() => {
    if (isHovered) {
      // Scramble to targetText (could be same as text for in-place, or different for transitions)
      // Always retrigger when isHovered is true and targetText prop changes (even if value is same)
      // This ensures animation retriggers when moving between projects with same title
      const targetChanged = targetRef.current !== actualTarget;
      const isAtTarget =
        !isAnimatingRef.current && displayTextRef.current === actualTarget;

      // Track previous targetText to detect prop changes even when value is same
      const targetTextPropChanged =
        previousTargetTextRef.current !== targetText;
      previousTargetTextRef.current = targetText;

      // Track retriggerKey changes - this forces retrigger when moving between same-title projects
      const retriggerKeyChanged = lastRetriggerKeyRef.current !== retriggerKey;
      if (retriggerKeyChanged) {
        lastRetriggerKeyRef.current = retriggerKey;
      }

      // Check if this is an in-place scramble (no targetText, so actualTarget === text)
      const isInPlaceScramble = targetText === undefined;

      // Always start if:
      // 1. Not animating and target changed, OR
      // 2. Currently animating but target changed, OR
      // 3. At target and targetText prop changed (for retriggering same project name), OR
      // 4. RetriggerKey changed (forces retrigger for same-title projects), OR
      // 5. In-place scramble (no targetText) - always scramble when hovered (even if already at target)
      const shouldStart =
        (!isAnimatingRef.current && targetChanged) ||
        (isAnimatingRef.current && targetChanged) ||
        (isAtTarget && targetTextPropChanged) ||
        (retriggerKeyChanged && isHovered) ||
        (isInPlaceScramble && isHovered);

      if (shouldStart && actualTarget !== "") {
        // Use current display TEXT (state) as starting point, not ref
        // The ref might be stale, but state is always current
        // Fallback to ref only if state seems wrong
        const currentFrom = displayText || displayTextRef.current || text;
        startScramble(currentFrom, actualTarget);
      }
    } else {
      // Scramble back to base text when not hovered
      if (displayText !== text) {
        // Only animate back if we're not already at the base text
        // Use state, not ref, to ensure we start from current display
        const currentFrom = displayText;
        startScramble(currentFrom, text);
      } else {
        // Already at base text, just ensure state is clean
        if (intervalRef.current) {
          cancelAnimationFrame(intervalRef.current);
          intervalRef.current = null;
        }
        isAnimatingRef.current = false;
        setDisplayText(text);
        targetRef.current = text;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, actualTarget, text, startScramble, retriggerKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
      }
    };
  }, []);

  return (
    <span className={className} style={{ ...style, willChange: "contents" }}>
      {displayText}
    </span>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(ScrambleText);
