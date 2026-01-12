import React, { useState, useEffect, useRef, useCallback } from 'react';

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
  scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  className = '',
  style = {},
  preserveSpaces = true,
  preserveSpecialChars = true,
  retriggerKey = 0
}) => {
  const actualTarget = targetText !== undefined ? targetText : text;
  
  // State for displayed text - always starts with base text
  const [displayText, setDisplayText] = useState<string>(text);
  
  // Refs to track animation state
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimatingRef = useRef<boolean>(false);
  const targetRef = useRef<string>(actualTarget);
  const fromTextRef = useRef<string>(text);
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
  
  const shouldPreserve = useCallback((char: string): boolean => {
    if (preserveSpaces && char === ' ') return true;
    if (preserveSpecialChars && /[^A-Za-z0-9\s]/.test(char)) return true;
    return false;
  }, [preserveSpaces, preserveSpecialChars]);
  
  const startScramble = useCallback((from: string, to: string) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:78',message:'startScramble called',data:{from,to,currentDisplay:displayTextRef.current,isAnimating:isAnimatingRef.current,hasInterval:!!intervalRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H8'})}).catch(()=>{});
    // #endregion
    
    // Clear any existing animation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Set refs immediately to prevent race conditions
    isAnimatingRef.current = true;
    fromTextRef.current = from;
    targetRef.current = to;
    
    const fromChars = from.split('');
    const toChars = to.split('');
    const maxLength = Math.max(fromChars.length, toChars.length);
    const intervalTime = scrambleDuration / iterations;
    let iteration = 0;
    
    const animate = () => {
      // Check if this animation was cancelled (target changed)
      if (targetRef.current !== to) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:103',message:'Animation cancelled - target changed',data:{currentTarget:targetRef.current,originalTo:to,iteration},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H8'})}).catch(()=>{});
        // #endregion
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        isAnimatingRef.current = false;
        return;
      }
      
      if (iteration >= iterations) {
        // Animation complete
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:115',message:'Animation complete',data:{to,iteration,totalIterations:iterations},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H8'})}).catch(()=>{});
        // #endregion
        setDisplayText(to);
        displayTextRef.current = to;
        isAnimatingRef.current = false;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }
      
      // Generate scrambled text
      const scrambled = Array.from({ length: maxLength }, (_, i) => {
        const toChar = toChars[i] || '';
        
        if (shouldPreserve(toChar)) {
          return toChar;
        }
        
        const progress = iteration / iterations;
        if (progress > 0.7) {
          return Math.random() > 0.3 ? toChar : getRandomChar();
        }
        
        return getRandomChar();
      }).join('');
      
      // #region agent log
      if (iteration === 0 || iteration === Math.floor(iterations / 2) || iteration === iterations - 1) {
        fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:140',message:'Animation step',data:{iteration,totalIterations:iterations,scrambled,from,to},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H8'})}).catch(()=>{});
      }
      // #endregion
      
      setDisplayText(scrambled);
      displayTextRef.current = scrambled;
      iteration++;
    };
    
    // Start animation
    intervalRef.current = setInterval(animate, intervalTime);
    animate(); // Run immediately
  }, [scrambleDuration, iterations, getRandomChar, shouldPreserve]);
  
  // Handle targetText changes (for project name transitions)
  // CRITICAL: Only run when actualTarget actually changes, not on every render
  useEffect(() => {
    // Check retriggerKey changes - this forces retrigger even when target is same
    const retriggerKeyChanged = lastRetriggerKeyRef.current !== retriggerKey;
    if (retriggerKeyChanged) {
      lastRetriggerKeyRef.current = retriggerKey;
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:163',message:'Effect triggered - targetText change',data:{text,targetText,actualTarget,lastActualTarget:lastActualTargetRef.current,displayText:displayTextRef.current,isAnimating:isAnimatingRef.current,targetRef:targetRef.current,hasInterval:!!intervalRef.current,retriggerKeyChanged},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H7'})}).catch(()=>{});
    // #endregion
    
    // If retriggerKey changed, force animation even if target is same
    if (retriggerKeyChanged && actualTarget !== '' && !isAnimatingRef.current) {
      const currentFrom = displayTextRef.current;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:175',message:'Retriggering due to retriggerKey change',data:{currentFrom,actualTarget,retriggerKey},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H7'})}).catch(()=>{});
      // #endregion
      startScramble(currentFrom, actualTarget);
      return;
    }
    
    // Skip if target hasn't actually changed and retriggerKey hasn't changed
    if (lastActualTargetRef.current === actualTarget && !retriggerKeyChanged) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:168',message:'Skipping - target unchanged',data:{actualTarget,lastActualTarget:lastActualTargetRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H7'})}).catch(()=>{});
      // #endregion
      return;
    }
    
    // Update last target immediately to prevent duplicate runs
    lastActualTargetRef.current = actualTarget;
    
    // Skip if currently animating to the same target (unless retriggerKey changed)
    if (isAnimatingRef.current && targetRef.current === actualTarget && !retriggerKeyChanged) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:177',message:'Skipping - already animating to target',data:{targetRef:targetRef.current,actualTarget},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H7'})}).catch(()=>{});
      // #endregion
      return;
    }
    
    // Skip if display already matches target and not animating (unless retriggerKey changed)
    if (!isAnimatingRef.current && displayTextRef.current === actualTarget && !retriggerKeyChanged) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:184',message:'Skipping - display matches target',data:{displayText:displayTextRef.current,actualTarget},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H7'})}).catch(()=>{});
      // #endregion
      targetRef.current = actualTarget;
      return;
    }
    
    // Start new animation - always use current display as starting point for seamless transitions
    // This ensures smooth transitions when switching between projects
    const currentFrom = displayTextRef.current;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:192',message:'Starting scramble animation',data:{currentFrom,actualTarget,currentDisplay:displayTextRef.current,wasAnimating:isAnimatingRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H7'})}).catch(()=>{});
    // #endregion
    startScramble(currentFrom, actualTarget);
    // actualTarget is derived from targetText, so we don't need targetText in deps
    // text is the base text and shouldn't trigger re-runs when it changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualTarget, startScramble, retriggerKey]);
  
  // Handle hover state (for logo, nav items, and project name transitions)
  // When isHovered is true, scramble to targetText (which may differ from text)
  // When isHovered is false, scramble back to base text
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:232',message:'Hover effect triggered',data:{isHovered,text,targetText,actualTarget,displayText,currentDisplay:displayTextRef.current,isAnimating:isAnimatingRef.current,targetRef:targetRef.current,previousTargetText:previousTargetTextRef.current,retriggerKey,lastRetriggerKey:lastRetriggerKeyRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    
    if (isHovered) {
      // Scramble to targetText (could be same as text for in-place, or different for transitions)
      // Always retrigger when isHovered is true and targetText prop changes (even if value is same)
      // This ensures animation retriggers when moving between projects with same title
      const targetChanged = targetRef.current !== actualTarget;
      const isAtTarget = !isAnimatingRef.current && displayTextRef.current === actualTarget;
      
      // Track previous targetText to detect prop changes even when value is same
      const targetTextPropChanged = previousTargetTextRef.current !== targetText;
      previousTargetTextRef.current = targetText;
      
      // Track retriggerKey changes - this forces retrigger when moving between same-title projects
      const retriggerKeyChanged = lastRetriggerKeyRef.current !== retriggerKey;
      if (retriggerKeyChanged) {
        lastRetriggerKeyRef.current = retriggerKey;
      }
      
      // Check if this is an in-place scramble (no targetText, so actualTarget === text)
      const isInPlaceScramble = targetText === undefined;
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:250',message:'Hover true - evaluating conditions',data:{isInPlaceScramble,targetChanged,isAtTarget,targetTextPropChanged,retriggerKeyChanged,targetRef:targetRef.current,actualTarget,text,displayText,currentDisplay:displayTextRef.current,isAnimating:isAnimatingRef.current,retriggerKey,lastRetriggerKey:lastRetriggerKeyRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      
      // Always start if:
      // 1. Not animating and target changed, OR
      // 2. Currently animating but target changed, OR
      // 3. At target and targetText prop changed (for retriggering same project name), OR
      // 4. RetriggerKey changed (forces retrigger for same-title projects), OR
      // 5. In-place scramble (no targetText) - always scramble when hovered (even if already at target)
      const shouldStart = (!isAnimatingRef.current && targetChanged) || 
                         (isAnimatingRef.current && targetChanged) || 
                         (isAtTarget && targetTextPropChanged) ||
                         (retriggerKeyChanged && isHovered) ||
                         (isInPlaceScramble && isHovered);
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:264',message:'Hover true - shouldStart decision',data:{shouldStart,isInPlaceScramble,isAnimating:isAnimatingRef.current,targetChanged,targetTextPropChanged,retriggerKeyChanged,actualTarget},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      
      if (shouldStart && actualTarget !== '') {
        // Use current display TEXT (state) as starting point, not ref
        // The ref might be stale, but state is always current
        // Fallback to ref only if state seems wrong
        const currentFrom = displayText || displayTextRef.current || text;
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:272',message:'Hover true - starting scramble',data:{currentFrom,actualTarget,displayTextState:displayText,displayTextRef:displayTextRef.current,retriggerKeyChanged,isInPlaceScramble},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
        // #endregion
        startScramble(currentFrom, actualTarget);
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ScrambleText.tsx:277',message:'Hover true - NOT starting scramble',data:{shouldStart,actualTarget,isAnimating:isAnimatingRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
        // #endregion
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
          clearInterval(intervalRef.current);
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
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <span className={className} style={style}>
      {displayText}
    </span>
  );
};

export default ScrambleText;
