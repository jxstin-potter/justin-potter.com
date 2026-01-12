import React, { useState, useEffect, useRef } from 'react';
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

interface MainContentProps {
  onProjectHover?: (project: ProjectData | null) => void;
}

const MainContent = ({ onProjectHover }: MainContentProps) => {
  const [hoveredProject, setHoveredProject] = useState<ProjectData | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [showFooter, setShowFooter] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track the target name parts for smooth transitions
  // This allows ScrambleText to transition from current display to new target seamlessly
  const [targetNameParts, setTargetNameParts] = useState<[string, string]>(['JUSTIN', 'POTTER']);
  // Retrigger key - increments when we want to force animation retrigger (e.g., moving between same-title projects)
  const [retriggerKey, setRetriggerKey] = useState<number>(0);
  const pendingProjectRef = useRef<ProjectData | null>(null);

  // Use shared hooks for consistent behavior
  useProjectHover(hoveredProject); // Triggers animation key updates
  const currentTime = useDisplayTime(hoveredProject);

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

  const projects = [
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
      imageUrl: project1Image, // Placeholder - replace with actual project image
      liveUrl: 'https://www.justin-potter.com/',
      year: 2025
    },
    {
      id: 3,
      title: 'Task Manager',
      imageUrl: project1Image, // Placeholder - replace with actual project image
      liveUrl: '#',
      year: 2024
    },
    {
      id: 4,
      title: 'API Dashboard',
      imageUrl: project1Image, // Placeholder - replace with actual project image
      liveUrl: '#',
      year: 2024
    },
    {
      id: 5,
      title: 'New Project',
      imageUrl: project1Image, // Placeholder - replace with actual project image
      liveUrl: '#',
      year: 2024
    }
  ];

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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainContent.tsx:153',message:'Effect triggered - hoveredProject changed',data:{hoveredProject:hoveredProject?.title || null,hasHoveredProject:!!hoveredProject,currentTargetParts:lastNamePartsRef.current,hoveredProjectYear:hoveredProject?.year || null},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    
    if (!hoveredProject) {
      // Reset to base name when no project is hovered
      const baseParts: [string, string] = ['JUSTIN', 'POTTER'];
      if (lastNamePartsRef.current[0] !== baseParts[0] || lastNamePartsRef.current[1] !== baseParts[1]) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainContent.tsx:160',message:'Setting targetNameParts to base',data:{baseParts,previousParts:lastNamePartsRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H3'})}).catch(()=>{});
        // #endregion
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
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainContent.tsx:170',message:'Computed new name parts',data:{projectTitle:hoveredProject.title,rawParts,normalizedParts:newParts,currentParts:lastNamePartsRef.current,willUpdate:lastNamePartsRef.current[0] !== rawParts[0] || lastNamePartsRef.current[1] !== rawParts[1]},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      // Compare raw parts (before normalization) to detect changes between unique identifiers
      // This ensures COMINGA vs COMINGB are detected as different, triggering rescramble
      const rawPartsChanged = lastNamePartsRef.current[0] !== rawParts[0] || lastNamePartsRef.current[1] !== rawParts[1];
      const normalizedPartsChanged = lastNormalizedPartsRef.current[0] !== newParts[0] || lastNormalizedPartsRef.current[1] !== newParts[1];
      
      if (rawPartsChanged) {
        // Raw parts changed (different unique identifier) - always update and retrigger
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainContent.tsx:175',message:'Updating targetNameParts - raw parts changed',data:{rawParts,normalizedParts:newParts,previousRawParts:lastNamePartsRef.current,previousNormalizedParts:lastNormalizedPartsRef.current,normalizedPartsChanged},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'H3'})}).catch(()=>{});
        // #endregion
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
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainContent.tsx:192',message:'Same raw parts, different project - incrementing retriggerKey',data:{rawParts,normalizedParts:newParts,currentParts:lastNamePartsRef.current,hoveredProjectTitle:hoveredProject.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run7',hypothesisId:'H9'})}).catch(()=>{});
        // #endregion
        // Increment retrigger key to force ScrambleText to detect change and retrigger
        setRetriggerKey(prev => prev + 1);
        lastNamePartsRef.current = rawParts;
        lastNormalizedPartsRef.current = newParts;
      }
      pendingProjectRef.current = hoveredProject;
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainContent.tsx:186',message:'Error computing name parts',data:{error:String(error),projectTitle:hoveredProject.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
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
              alignItems: 'center',
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
          </div>

          {/* Wrapper for Designer & Developer and Location/Time - horizontal layout */}
          <div
            style={{
              gridColumn: '2',
              gridRow: '1 / 3',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: '6rem',
              width: 'auto',
              justifyContent: 'flex-end',
              alignSelf: 'center',
              transform: 'translateX(8rem)'
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
              width: 'auto',
              padding: 0,
              margin: 0
            }}
          >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 0,
                  width: 'auto',
                  padding: 0,
                  margin: 0,
                  minHeight: '2.4rem'
                }}
              >
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
                    textAlign: 'left'
                  }}
                >
                  <ScrambleText
                    text="DESIGNER &"
                    targetText={hoveredProject ? "DESIGNER" : "DESIGNER &"}
                    isHovered={!!hoveredProject}
                    scrambleDuration={250}
                    preserveSpaces={true}
                  />
                </p>
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
                    lineHeight: '1.2',
                    textAlign: 'left'
                  }}
                >
                  <ScrambleText
                    text="DEVELOPER"
                    targetText="DEVELOPER"
                    isHovered={!!hoveredProject}
                    scrambleDuration={250}
                    preserveSpaces={true}
                  />
                </p>
              </div>
          </motion.div>

          {/* Location/Time - positioned to the right of Designer & Developer */}
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'var(--primary-white)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: 0,
              padding: 0,
              textAlign: 'left',
              width: 'auto',
              whiteSpace: 'nowrap',
              minWidth: '120px',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start'
            }}
          >
            <AnimatePresence mode="wait">
              {hoveredProject ? (
                <motion.span
                  key="year"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ 
                    display: 'block', 
                    textAlign: 'left',
                    position: 'absolute',
                    left: 0,
                    top: 0
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
                    display: 'block', 
                    textAlign: 'left',
                    position: 'absolute',
                    left: 0,
                    top: 0
                  }}
                >
                  BROOKLYN, NY {displayTime}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          </div>
        </motion.div>
        </div>

        {/* Projects Section - Independent Container */}
        <div
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
            onMouseDown={(e) => {
              const container = e.currentTarget;
              container.style.cursor = 'grabbing';
              let isDown = true;
              let startX = e.pageX - container.offsetLeft;
              let scrollLeft = container.scrollLeft;

              const handleMouseMove = (e: MouseEvent) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const walk = (x - startX) * 2;
                container.scrollLeft = scrollLeft - walk;
              };

              const handleMouseUp = () => {
                isDown = false;
                container.style.cursor = 'grab';
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
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
                  onMouseEnter={(e) => {
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainContent.tsx:515',message:'onMouseEnter triggered',data:{projectId:project.id,projectTitle:project.title,currentHoveredProject:hoveredProject?.title || null},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H6'})}).catch(()=>{});
                    // #endregion
                    
                    // Clear any pending timeout to prevent reset when quickly moving between cards
                    if (hoverTimeoutRef.current) {
                      clearTimeout(hoverTimeoutRef.current);
                      hoverTimeoutRef.current = null;
                    }
                    
                    // For projects 2-5, use unique internal names to trigger rescramble
                    // These are internal identifiers - display stays as "COMING SOON" (no numbers shown)
                    const isComingSoon = project.id >= 2 && project.id <= 5;
                    // Use unique names where both first and second parts differ to force both to rescramble
                    const comingSoonNames = {
                      2: 'COMINGA SOONA',
                      3: 'COMINGB SOONB', 
                      4: 'COMINGC SOONC',
                      5: 'COMINGD SOOND'
                    };
                    const projectData: ProjectData = {
                      title: isComingSoon ? comingSoonNames[project.id as keyof typeof comingSoonNames] : project.title,
                      year: isComingSoon ? 2026 : project.year
                    };
                    
                    // Check if we're moving to a different card (different ID) - check BEFORE setting hoveredCardId
                    const isDifferentCard = hoveredCardId !== project.id;
                    
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainContent.tsx:586',message:'onMouseEnter - checking card change',data:{projectId:project.id,currentHoveredCardId:hoveredCardId,isDifferentCard,currentHoveredProjectTitle:hoveredProject?.title || null,currentHoveredProjectYear:hoveredProject?.year || null,projectDataTitle:projectData.title,projectDataYear:projectData.year},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H1'})}).catch(()=>{});
                    // #endregion
                    
                    // Set card hover state immediately for visual feedback
                    setHoveredCardId(project.id);
                    
                    // Check if it's the same card with the same data - skip update in that case
                    const isSameCardAndData = !isDifferentCard && 
                      hoveredProject && 
                      hoveredProject.title === projectData.title && 
                      hoveredProject.year === projectData.year;
                    
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainContent.tsx:599',message:'onMouseEnter - checking same card/data',data:{isSameCardAndData,isDifferentCard,hasHoveredProject:!!hoveredProject},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H1'})}).catch(()=>{});
                    // #endregion
                    
                    if (isSameCardAndData) {
                      // Same card and same data - don't retrigger
                      // #region agent log
                      fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainContent.tsx:605',message:'Skipping - same card and data',data:{projectId:project.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H1'})}).catch(()=>{});
                      // #endregion
                      return;
                    }
                    
                    // Always retrigger animation when moving to a different card
                    // This ensures animation retriggers when hovering from [02] to [03] etc., even if title/year are the same
                    if (isDifferentCard && hoveredProject && hoveredProject.title === projectData.title && hoveredProject.year === projectData.year) {
                      // Same title/year but different card (e.g., moving between COMING SOON projects)
                      // Temporarily clear hoveredProject to force animation retrigger
                      // #region agent log
                      fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainContent.tsx:614',message:'Retriggering - different card, same title/year',data:{projectId:project.id,projectData,previousHoveredProject:hoveredProject},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H2'})}).catch(()=>{});
                      // #endregion
                      setHoveredProject(null);
                      // Use setTimeout to ensure state update completes before setting new project
                      setTimeout(() => {
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainContent.tsx:620',message:'setTimeout callback - setting projectData',data:{projectData},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H2'})}).catch(()=>{});
                        // #endregion
                        setHoveredProject(projectData);
                      }, 0);
                    } else {
                      // Different project data or first hover - update immediately
                      // #region agent log
                      fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainContent.tsx:625',message:'Calling setHoveredProject directly',data:{projectData,currentHoveredProject:hoveredProject?.title || null,projectId:project.id,isDifferentCard},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H1'})}).catch(()=>{});
                      // #endregion
                      
                      // Update hovered project immediately to trigger name scramble
                      // The ScrambleText component will handle the transition smoothly
                      setHoveredProject(projectData);
                    }
                  }}
                  onMouseLeave={(e) => {
                    // Clear card hover state immediately
                    setHoveredCardId(null);
                    
                    // Clear any pending timeout
                    if (hoverTimeoutRef.current) {
                      clearTimeout(hoverTimeoutRef.current);
                      hoverTimeoutRef.current = null;
                    }
                    
                    // Reset hovered project to trigger scramble back to "JUSTIN POTTER"
                    // Small delay allows smooth transition if moving between cards quickly
                    // If user hovers another card within 100ms, the timeout will be cleared
                    hoverTimeoutRef.current = setTimeout(() => {
                      setHoveredProject(null);
                      hoverTimeoutRef.current = null;
                    }, 100);
                  }}
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
                    {project.id >= 2 && project.id <= 5 ? (
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
        </div>
      </div>
      {/* Footer at bottom of content */}
      <Footer showFooter={showFooter} />
    </motion.section>
  );
};

export default MainContent;
