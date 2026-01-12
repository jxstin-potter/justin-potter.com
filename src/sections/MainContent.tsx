import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import project1Image from '../assets/landingpage.png';
import { ProjectData } from '../types';
import {
  containerVariants,
  hoverAnimationVariants,
  subtitleVariants,
  hoverTransition,
  DURATION,
  EASING,
} from '../utils/animations';
import { getDisplayName, formatDisplayTime } from '../utils/helpers';
import { useProjectHover, useDisplayTime } from '../utils/hooks';
import Footer from '../components/Footer';

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
  
  // Use shared hooks for consistent behavior
  const animationKey = useProjectHover(hoveredProject);
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

  // Get name parts for display
  const nameParts = useMemo(() => {
    try {
      return hoveredProject ? getDisplayName(hoveredProject.title) : ['JUSTIN', 'POTTER'];
    } catch (error) {
      return ['JUSTIN', 'POTTER'];
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
              gridTemplateColumns: '1fr auto auto',
              gridTemplateRows: 'auto auto',
              alignItems: 'flex-start',
              gap: 'var(--spacing-md)',
              width: '100%',
              marginTop: 'var(--hero-top-margin)',
              marginLeft: 'var(--hero-left-margin)',
              position: 'relative'
            }}
          >
          {/* Name - spans first column and both rows */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start', 
            overflow: 'visible',
            gridColumn: '1',
            gridRow: '1 / 3'
          }}>
            <motion.h1
              key={`${nameParts[0]}-${animationKey}`}
              initial="initial"
              animate={hoveredProject ? "animate" : "initial"}
              variants={hoverAnimationVariants}
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
              {nameParts[0]}
            </motion.h1>
            {nameParts[1] && (
              <motion.h1
                key={`${nameParts[1]}-${animationKey}`}
                initial="initial"
                animate={hoveredProject ? "animate" : "initial"}
                variants={hoverAnimationVariants}
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
                {nameParts[1]}
              </motion.h1>
            )}
          </div>

          {/* Designer & Developer / Design & Development - Second column, first row */}
          <motion.div
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
            style={{
              gridColumn: '2',
              gridRow: '1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 0,
              textAlign: 'left',
              minWidth: '6rem',
              position: 'absolute',
              minHeight: '2.4rem'
            }}
          >
              <AnimatePresence mode="wait">
                {hoveredProject ? (
                  <motion.div
                    key="project-text"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: DURATION.normal, ease: EASING }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 0,
                      width: '100%'
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        color: 'var(--primary-white)',
                        margin: 0,
                        letterSpacing: '0.1em',
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        lineHeight: 1.2
                      }}
                    >
                      Design
                    </p>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        color: 'var(--primary-white)',
                        margin: 0,
                        letterSpacing: '0.1em',
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        lineHeight: 1.2
                      }}
                    >
                      Development
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default-text"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: DURATION.normal, ease: EASING }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 0,
                      width: '100%'
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        color: 'var(--primary-white)',
                        margin: 0,
                        letterSpacing: '0.1em',
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        lineHeight: 1.2
                      }}
                    >
                      Designer &
                    </p>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        color: 'var(--primary-white)',
                        margin: 0,
                        letterSpacing: '0.1em',
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        lineHeight: 1.2
                      }}
                    >
                      Developer
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
          </motion.div>

          {/* Location/Time - Second column, second row */}
          <div
            style={{
              gridColumn: '2',
              gridRow: '2',
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'var(--primary-white)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: 0,
              textAlign: 'left',
              position: 'relative',
              minHeight: '1.05rem'
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
                >
                  Brooklyn, NY {displayTime}
                </motion.span>
              )}
            </AnimatePresence>
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
                    // Clear any pending timeout to prevent clearing hover state
                    if (hoverTimeoutRef.current) {
                      clearTimeout(hoverTimeoutRef.current);
                      hoverTimeoutRef.current = null;
                    }
                    setHoveredCardId(project.id);
                    // For projects 2-5, show "COMING SOON" and year 2026
                    const isComingSoon = project.id >= 2 && project.id <= 5;
                    const projectData = { 
                      title: isComingSoon ? 'COMING SOON' : project.title, 
                      year: isComingSoon ? 2026 : project.year 
                    };
                    setHoveredProject(projectData);
                  }}
                  onMouseLeave={(e) => {
                    // Add a small delay before clearing to allow smooth transition between cards
                    hoverTimeoutRef.current = setTimeout(() => {
                      setHoveredCardId(null);
                      setHoveredProject(null);
                      hoverTimeoutRef.current = null;
                    }, 50);
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
