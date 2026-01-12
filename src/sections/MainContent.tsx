import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import project1Image from '../assets/landingpage.png';
import { ProjectData } from '../types';
import {
  containerVariants,
  hoverTransition,
  DURATION,
  EASING,
} from '../utils/animations';
import { getDisplayName, formatDisplayTime, normalizeComingSoon } from '../utils/helpers';
import { useProjectHover, useDisplayTime } from '../utils/hooks';
import Footer from '../components/Footer';
import ScrambleText from '../components/ScrambleText';

// Constants
const COMING_SOON_PROJECT_IDS = { min: 2, max: 5 } as const;
const HOVER_RESET_DELAY = 100; // ms
const WELCOME_SCRAMBLE_DELAY = 100; // ms
const WELCOME_TRANSITION_DELAY = 600; // ms
const DRAG_MULTIPLIER = 2;

// Coming soon project name mapping - unique identifiers for animation retriggering
const COMING_SOON_NAMES: Record<number, string> = {
  2: 'COMINGA SOONA',
  3: 'COMINGB SOONB',
  4: 'COMINGC SOONC',
  5: 'COMINGD SOOND'
} as const;

// Project type definition
interface Project {
  id: number;
  title: string;
  imageUrl: string;
  liveUrl: string;
  year: number;
}

interface MainContentProps {
  onProjectHover?: (project: ProjectData | null) => void;
  shouldScrambleFromWelcome?: boolean;
  showWelcome?: boolean;
}

const MainContent = ({ onProjectHover, shouldScrambleFromWelcome = false, showWelcome = false }: MainContentProps) => {
  const [hoveredProject, setHoveredProject] = useState<ProjectData | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [showFooter, setShowFooter] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track the target name parts for smooth transitions
  // This allows ScrambleText to transition from current display to new target seamlessly
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
  }, [shouldScrambleFromWelcome, welcomeTransitionComplete]);
  
  // Update targetNameParts when showWelcome changes
  useEffect(() => {
    if (showWelcome && !shouldScrambleFromWelcome) {
      // Welcome is showing but not yet scrambling - show WELCOME
      setTargetNameParts(['WELCOME', '']);
      setWelcomeTransitionComplete(false);
    }
  }, [showWelcome, shouldScrambleFromWelcome]);
  // Retrigger key - increments when we want to force animation retrigger (e.g., moving between same-title projects)
  const [retriggerKey, setRetriggerKey] = useState<number>(0);
  const pendingProjectRef = useRef<ProjectData | null>(null);

  // Use shared hooks for consistent behavior
  useProjectHover(hoveredProject); // Triggers animation key updates
  const currentTime = useDisplayTime(hoveredProject);

  // Memoize projects array to prevent unnecessary re-renders
  const projects = useMemo<Project[]>(() => [
    {
      id: 1,
      title: 'CommerceFlow',
      imageUrl: project1Image,
      liveUrl: 'https://commerce-flow-v2.vercel.app/',
      year: 2025
    },
    {
      id: 2,
      title: 'Portfolio Site',
      imageUrl: project1Image,
      liveUrl: 'https://www.justin-potter.com/',
      year: 2025
    },
    {
      id: 3,
      title: 'Task Manager',
      imageUrl: project1Image,
      liveUrl: '#',
      year: 2024
    },
    {
      id: 4,
      title: 'API Dashboard',
      imageUrl: project1Image,
      liveUrl: '#',
      year: 2024
    },
    {
      id: 5,
      title: 'New Project',
      imageUrl: project1Image,
      liveUrl: '#',
      year: 2024
    }
  ], []);

  // Helper function to get project data with coming soon handling
  const getProjectData = useCallback((project: Project): ProjectData => {
    const isComingSoon = project.id >= COMING_SOON_PROJECT_IDS.min && project.id <= COMING_SOON_PROJECT_IDS.max;
    return {
      title: isComingSoon ? COMING_SOON_NAMES[project.id] : project.title,
      year: isComingSoon ? 2026 : project.year
    };
  }, []);

  // Optimized project hover enter handler
  const handleProjectMouseEnter = useCallback((project: Project) => {
    // Clear any pending timeout to prevent reset when quickly moving between cards
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    const projectData = getProjectData(project);
    const isDifferentCard = hoveredCardId !== project.id;
    
    // Set card hover state immediately for visual feedback
    setHoveredCardId(project.id);
    
    // Check if it's the same card with the same data - skip update in that case
    const isSameCardAndData = !isDifferentCard && 
      hoveredProject && 
      hoveredProject.title === projectData.title && 
      hoveredProject.year === projectData.year;
    
    if (isSameCardAndData) {
      return; // Same card and same data - don't retrigger
    }
    
    // Handle different card with same title/year (e.g., COMING SOON projects)
    if (isDifferentCard && hoveredProject && 
        hoveredProject.title === projectData.title && 
        hoveredProject.year === projectData.year) {
      // Temporarily clear to force animation retrigger
      setHoveredProject(null);
      // Use requestAnimationFrame for better performance than setTimeout(0)
      requestAnimationFrame(() => {
        setHoveredProject(projectData);
      });
    } else {
      // Different project data or first hover - update immediately
      setHoveredProject(projectData);
    }
  }, [hoveredCardId, hoveredProject, getProjectData]);

  // Optimized project hover leave handler
  const handleProjectMouseLeave = useCallback(() => {
    // Clear card hover state immediately
    setHoveredCardId(null);
    
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Reset hovered project with delay to allow smooth transitions
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredProject(null);
      hoverTimeoutRef.current = null;
    }, HOVER_RESET_DELAY);
  }, []);

  // Optimized drag handler for project container
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

  // Track scroll to show/hide footer
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (tagName === 'main' && (style.overflowY === 'auto' || style.overflowY === 'scroll')) {
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
        const nearBottom = maxScroll > nearBottomThreshold && scrollTop >= maxScroll - nearBottomThreshold;
        const pastThreshold = scrollTop >= threshold;
        const shouldShow = pastThreshold || nearBottom;
        setShowFooter(shouldShow);
      };

      // Check initial scroll position - should be 0, so footer should be hidden
      handleScroll();

      scrollableMain.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollableMain.removeEventListener('scroll', handleScroll);
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
  }, []);

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Notify parent of hover changes
  useEffect(() => {
    if (onProjectHover) {
      onProjectHover(hoveredProject);
    }
  }, [hoveredProject, onProjectHover]);

  // Track last raw name parts (before normalization) to detect changes between unique identifiers
  const lastNamePartsRef = useRef<[string, string]>(['JUSTIN', 'POTTER']);
  // Track last normalized parts for comparison
  const lastNormalizedPartsRef = useRef<[string, string]>(['JUSTIN', 'POTTER']);
  
  // Update target name parts when hoveredProject changes
  // This is separate from the base text to allow smooth transitions
  useEffect(() => {
    if (!hoveredProject) {
      // Reset to base name when no project is hovered
      const baseParts: [string, string] = ['JUSTIN', 'POTTER'];
      if (lastNamePartsRef.current[0] !== baseParts[0] || lastNamePartsRef.current[1] !== baseParts[1]) {
        setTargetNameParts(baseParts);
        lastNamePartsRef.current = baseParts;
        lastNormalizedPartsRef.current = baseParts;
      }
      pendingProjectRef.current = null;
      return;
    }
    
    try {
      const rawParts = getDisplayName(hoveredProject.title);
      // Normalize for display (removes extra letters from COMING* SOON* variants)
      const newParts = normalizeComingSoon(rawParts);
      // Compare raw parts (before normalization) to detect changes between unique identifiers
      // This ensures COMINGA vs COMINGB are detected as different, triggering rescramble
      const rawPartsChanged = lastNamePartsRef.current[0] !== rawParts[0] || lastNamePartsRef.current[1] !== rawParts[1];
      const normalizedPartsChanged = lastNormalizedPartsRef.current[0] !== newParts[0] || lastNormalizedPartsRef.current[1] !== newParts[1];
      
      if (rawPartsChanged) {
        // Raw parts changed (different unique identifier) - always update and retrigger
        // Set normalized parts for display (shows "COMING SOON" without extra letters)
        setTargetNameParts(newParts);
        // If normalized parts are the same but raw parts changed, force retrigger with key
        // This ensures rescramble when moving between COMING SOON cards
        if (!normalizedPartsChanged) {
          setRetriggerKey(prev => prev + 1);
        }
        // Store both raw and normalized parts for comparison
        lastNamePartsRef.current = rawParts;
        lastNormalizedPartsRef.current = newParts;
      } else {
        // Raw parts are the same but hoveredProject changed (shouldn't happen with unique names)
        // Force retrigger by incrementing retriggerKey - this will be passed to ScrambleText
        // Increment retrigger key to force ScrambleText to detect change and retrigger
        setRetriggerKey(prev => prev + 1);
        lastNamePartsRef.current = rawParts;
        lastNormalizedPartsRef.current = newParts;
      }
      pendingProjectRef.current = hoveredProject;
    } catch (error) {
      const baseParts: [string, string] = ['JUSTIN', 'POTTER'];
      if (lastNamePartsRef.current[0] !== baseParts[0] || lastNamePartsRef.current[1] !== baseParts[1]) {
        setTargetNameParts(baseParts);
        lastNamePartsRef.current = baseParts;
      }
      pendingProjectRef.current = null;
    }
  }, [hoveredProject]);

  // Display year when hovering, current time otherwise
  const displayTime = (() => {
    try {
      return formatDisplayTime(hoveredProject, currentTime);
    } catch (error) {
      return hoveredProject ? hoveredProject.year.toString() : '00:00:00';
    }
  })();


  return (
    <motion.section
      ref={sectionRef}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        minHeight: 'calc(100vh + 20px)',
        paddingTop: 'calc(var(--spacing-lg) + 50px)',
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: '20px',
        backgroundColor: 'transparent'
      }}
    >
      {/* Hero and Projects in separate containers */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          margin: '0',
          position: 'relative',
          zIndex: 1,
          flex: 'none'
        }}
      >
        {/* Hero Section - Independent Container */}
        <div
          style={{
            width: '100%',
            padding: `0 var(--hero-right-padding) 0 0`,
            margin: '0',
            flexShrink: 0,
            position: 'relative',
            marginTop: '-75px'
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: 'auto auto',
              alignItems: 'flex-start',
              gap: 'var(--spacing-md)',
              width: '100%',
              maxWidth: '100%',
              marginTop: 'var(--hero-top-margin)',
              marginLeft: 'var(--hero-left-margin)',
              marginRight: 'var(--header-right-padding)',
              position: 'relative'
            }}
          >
          {/* Hero Name - scrambles to project title when hovering project cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            overflow: 'visible',
            gridColumn: '1',
            gridRow: '1 / 3'
          }}>
            {!welcomeTransitionComplete ? (
              // Single entity scramble: WELCOME -> JUSTIN (as one animation)
              <h1
                style={{
                  fontSize: 'clamp(3.5rem, 12vw, 9.5rem)',
                  fontWeight: 450,
                  lineHeight: 0.85,
                  letterSpacing: '-0.03em',
                  color: 'var(--primary-white)',
                  margin: 0,
                  fontFamily: 'var(--font-primary)',
                  textTransform: 'uppercase',
                  position: 'relative'
                }}
              >
                <ScrambleText
                  text="WELCOME"
                  targetText={shouldScrambleFromWelcome ? "JUSTIN" : undefined}
                  isHovered={shouldScrambleFromWelcome}
                  scrambleDuration={500}
                  iterations={10}
                  preserveSpaces={true}
                  retriggerKey={retriggerKey}
                />
              </h1>
            ) : (
              // Two-part system for project hovers (after welcome transition)
              <>
                <h1
                  style={{
                    fontSize: 'clamp(3.5rem, 12vw, 9.5rem)',
                    fontWeight: 450,
                    lineHeight: 0.85,
                    letterSpacing: '-0.03em',
                    color: 'var(--primary-white)',
                    margin: 0,
                    fontFamily: 'var(--font-primary)',
                    textTransform: 'uppercase',
                    position: 'relative'
                  }}
                >
                  <ScrambleText
                    text="JUSTIN"
                    targetText={targetNameParts[0]}
                    isHovered={!!hoveredProject}
                    scrambleDuration={250}
                    preserveSpaces={true}
                    retriggerKey={retriggerKey}
                  />
                </h1>
                {targetNameParts[1] && (
                  <h1
                    style={{
                      fontSize: 'clamp(3.5rem, 12vw, 9.5rem)',
                      fontWeight: 450,
                      lineHeight: 0.85,
                      letterSpacing: '-0.03em',
                      color: 'var(--primary-white)',
                      margin: 0,
                      fontFamily: 'var(--font-primary)',
                      textTransform: 'uppercase',
                      position: 'relative'
                    }}
                  >
                    <ScrambleText
                      text="POTTER"
                      targetText={targetNameParts[1]}
                      isHovered={!!hoveredProject}
                      scrambleDuration={250}
                      preserveSpaces={true}
                      retriggerKey={retriggerKey}
                    />
                  </h1>
                )}
              </>
            )}
          </div>

          {/* Wrapper for Designer & Developer and Location/Time - horizontal layout */}
          <div
            style={{
              gridColumn: '2',
              gridRow: '1 / 3',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              alignContent: 'flex-start',
              gap: '6rem',
              width: 'max-content',
              minWidth: 'max-content',
              justifyContent: 'flex-end',
              alignSelf: 'flex-start',
              transform: 'translate(16rem, 8rem)',
              position: 'relative'
            }}
          >
          {/* Designer & Developer / Design & Development - Second column, first row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.8,
              duration: DURATION.slow,
              ease: EASING,
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 0,
              textAlign: 'left',
              minHeight: '2.4rem',
              width: 'max-content',
              padding: 0,
              margin: 0,
              flexShrink: 0
            }}
          >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 0,
                  padding: 0,
                  margin: 0,
                  minHeight: '2.4rem',
                  position: 'relative',
                  width: 'max-content'
                }}
              >
                {/* Container with fixed width to prevent layout shifts - spacer maintains width in normal flow */}
                <div
                  style={{
                    position: 'relative',
                    minHeight: '2.4rem',
                    display: 'inline-block'
                  }}
                >
                  {/* Hidden width spacer in normal flow - maintains container width */}
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      letterSpacing: '0.1em',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      lineHeight: 1.2,
                      visibility: 'hidden',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      margin: 0,
                      padding: 0,
                      height: '1.2em'
                    }}
                    aria-hidden="true"
                  >
                    DESIGNER & DEVELOPER
                  </span>
                  {/* Single ScrambleText element - absolutely positioned to overlay spacer exactly */}
                  <p
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      color: 'var(--primary-white)',
                      margin: 0,
                      padding: 0,
                      letterSpacing: '0.1em',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      lineHeight: 1.2,
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '1.2em'
                    }}
                  >
                    <ScrambleText
                      text="DESIGNER & DEVELOPER"
                      targetText={hoveredProject ? "DESIGNER DEVELOPER" : "DESIGNER & DEVELOPER"}
                      isHovered={!!hoveredProject}
                      scrambleDuration={250}
                      preserveSpaces={true}
                      style={{ display: 'inline-block' }}
                    />
                  </p>
                </div>
              </div>
          </motion.div>

          {/* Location/Time - PORTFOLIO 2026 -> BROOKLYN, NY as one entity */}
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 400,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: 0,
              padding: 0,
              textAlign: 'left',
              width: 'max-content',
              minWidth: '120px',
              whiteSpace: 'nowrap',
              position: 'relative',
              flexShrink: 0,
              height: '1.2em'
            }}
          >
            {/* Container with fixed width to prevent layout shifts */}
            <div
              style={{
                position: 'relative',
                minHeight: '1.2em',
                display: 'inline-block'
              }}
            >
              {/* Hidden width spacer - maintains container width */}
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  letterSpacing: '0.1em',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                  visibility: 'hidden',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  margin: 0,
                  padding: 0,
                  height: '1.2em'
                }}
                aria-hidden="true"
              >
                BROOKLYN, NY 12:00 PM
              </span>
              {/* Single element - absolutely positioned to overlay spacer exactly */}
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  color: 'var(--primary-white)',
                  margin: 0,
                  padding: 0,
                  letterSpacing: '0.1em',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '1.2em',
                  width: '100%'
                }}
              >
                {!welcomeTransitionComplete ? (
                  <ScrambleText
                    text="PORTFOLIO 2026"
                    targetText={shouldScrambleFromWelcome ? `BROOKLYN, NY ${displayTime}` : undefined}
                    isHovered={shouldScrambleFromWelcome}
                    scrambleDuration={500}
                    iterations={10}
                    preserveSpaces={true}
                    retriggerKey={retriggerKey}
                    style={{ display: 'inline-block' }}
                  />
                ) : (
                  <span style={{ display: 'inline-block', position: 'relative', width: '100%' }}>
                    <AnimatePresence mode="wait">
                      {hoveredProject ? (
                        <motion.span
                          key="year"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          style={{ 
                            display: 'inline-block', 
                            textAlign: 'left',
                            position: 'relative'
                          }}
                        >
                          {displayTime}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="location"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          style={{ 
                            display: 'inline-block', 
                            textAlign: 'left',
                            position: 'relative'
                          }}
                        >
                          BROOKLYN, NY {displayTime}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                )}
              </p>
            </div>
          </div>
          </div>
        </motion.div>
        </div>

        {/* Projects Section - Independent Container */}
        <AnimatePresence>
          {welcomeTransitionComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.normal, ease: EASING, delay: 0.2 }}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                flexShrink: 0,
                paddingTop: 'calc(var(--spacing-xl) + 4rem)',
                paddingBottom: 'var(--spacing-sm)',
                paddingLeft: 0,
                paddingRight: 0,
                boxSizing: 'border-box'
              }}
            >

          {/* Horizontal Scrollable Projects Container */}
          <div
            ref={containerRef}
            style={{
              display: 'flex',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              cursor: 'grab',
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
              paddingBottom: '0',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
              gap: 'var(--spacing-md)'
            }}
            onMouseDown={handleContainerMouseDown}
              >
                <style>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                {/* Projects List */}
                <div style={{
              display: 'flex',
              gap: '1rem',
              minWidth: 'max-content',
              alignItems: 'flex-end',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              {projects.map((project, index) => {
                const isHovered = hoveredCardId === project.id;
                const isAnyCardHovered = hoveredCardId !== null;
                return (
                <motion.a
                  key={project.id}
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  data-project-id={project.id}
                  className="bracket-hover"
                  onMouseEnter={() => handleProjectMouseEnter(project)}
                  onMouseLeave={handleProjectMouseLeave}
                  animate={{
                    filter: isAnyCardHovered && !isHovered ? 'blur(4px)' : 'blur(0px)',
                    scale: isHovered ? 1.02 : 1
                  }}
                  transition={{
                    opacity: { duration: DURATION.slow, delay: index * 0.1, ease: EASING },
                    x: { duration: DURATION.slow, delay: index * 0.1, ease: EASING },
                    filter: { duration: DURATION.fast, ease: EASING },
                    scale: { duration: DURATION.fast, ease: EASING },
                    default: { duration: DURATION.slow, delay: index * 0.1, ease: EASING }
                  }}
                  style={{
                    minWidth: '320px',
                    maxWidth: '320px',
                    scrollSnapAlign: 'start',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-xs)',
                    position: 'relative',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    alignSelf: 'flex-end'
                  }}
                >
                  {/* Project Image */}
                  <motion.div
                    whileHover={{
                      scale: isHovered ? 1.05 : 1,
                      transition: { duration: DURATION.fast, ease: EASING }
                    }}
                    animate={{
                      scaleY: isAnyCardHovered && !isHovered ? 0.85 : 1,
                      originY: 1
                    }}
                    transition={{ duration: DURATION.fast, ease: EASING }}
                    onMouseEnter={(e) => e.stopPropagation()}
                    style={{
                      width: '100%',
                      height: '220px',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: 'var(--dark-grey)',
                      flexShrink: 0,
                      zIndex: 1,
                      pointerEvents: 'auto',
                      borderRadius: '2px',
                      transformOrigin: 'bottom',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {project.id >= COMING_SOON_PROJECT_IDS.min && project.id <= COMING_SOON_PROJECT_IDS.max ? (
                      <motion.div
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 400,
                          color: 'var(--medium-grey)',
                          fontFamily: 'var(--font-mono)',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          textAlign: 'center'
                        }}
                      >
                        COMING SOON
                      </motion.div>
                    ) : (
                      <>
                        <motion.img
                          src={project.imageUrl}
                          alt={project.title}
                          whileHover={{
                            filter: 'brightness(1.1)',
                            transition: { duration: DURATION.fast, ease: EASING }
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'filter 0.3s ease'
                          }}
                        />
                        {/* Overlay on hover */}
                        {hoveredCardId === project.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: DURATION.fast }}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.1) 100%)',
                              pointerEvents: 'none'
                            }}
                          />
                        )}
                      </>
                    )}
                  </motion.div>
                  {/* Project Number and View Link */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingTop: '-0.55rem'
                  }}>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--primary-white)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.1em',
                        opacity: 0.9
                      }}
                    >
                      <span className="bracket">[</span>{String(index + 1).padStart(2, '0')}<span className="bracket">]</span>
                    </div>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: hoveredCardId === project.id ? 1 : 0,
                        x: hoveredCardId === project.id ? 0 : -10
                      }}
                      whileHover={{
                        color: 'var(--lime-green)',
                        x: hoveredCardId === project.id ? 5 : 0
                      }}
                      transition={hoverTransition}
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--primary-white)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        pointerEvents: 'none',
                        marginTop: '-0.75px',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      View Project →
                    </motion.span>
                  </div>
                </motion.a>
                );
              })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Footer at bottom of content */}
      <Footer showFooter={showFooter} />
    </motion.section>
  );
};

export default MainContent;
