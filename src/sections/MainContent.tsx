import React, { useRef, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { ProjectData } from '../types';
import { useDisplayTime } from '../utils/hooks';
import { formatDisplayTime } from '../utils/helpers';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import ProjectsList from '../components/sections/ProjectsList';
import { useProjectHoverState } from '../hooks/useProjectHoverState';
import { useScrollTracking } from '../hooks/useScrollTracking';
import { useNameParts } from '../hooks/useNameParts';
import { projectSummaries } from '../data/projects';

interface MainContentProps {
  onProjectHover?: (project: ProjectData | null) => void;
  shouldScrambleFromWelcome?: boolean;
  welcomeTransitionComplete?: boolean;
  welcomeTargetNameParts?: [string, string];
}

const MainContent = ({
  onProjectHover,
  shouldScrambleFromWelcome = false,
  welcomeTransitionComplete = true,
  welcomeTargetNameParts = ['JUSTIN', 'POTTER'],
}: MainContentProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Project hover state management
  const {
    hoveredProject,
    hoveredCardId,
    handleProjectMouseEnter,
    handleProjectMouseLeave,
  } = useProjectHoverState(onProjectHover);

  // Scroll tracking for footer visibility
  const showFooter = useScrollTracking(sectionRef);

  // Name parts management based on hovered project
  const {
    targetNameParts: hoverTargetNameParts,
    retriggerKey,
    setTargetNameParts: setHoverTargetNameParts,
  } = useNameParts(hoveredProject, welcomeTargetNameParts);

  // Sync welcome transition name parts with hover name parts
  React.useEffect(() => {
    if (welcomeTransitionComplete) {
      setHoverTargetNameParts(welcomeTargetNameParts);
    }
  }, [welcomeTransitionComplete, welcomeTargetNameParts, setHoverTargetNameParts]);

  // Use shared hooks for consistent behavior
  const currentTime = useDisplayTime();

  // Memoize projects array to prevent unnecessary re-renders
  const projects = useMemo(() => {
    const prioritizedSlug = 'commerceflow';
    return [...projectSummaries].sort((a, b) => {
      if (a.slug === prioritizedSlug && b.slug !== prioritizedSlug) return -1;
      if (b.slug === prioritizedSlug && a.slug !== prioritizedSlug) return 1;
      return b.year - a.year || b.id - a.id;
    });
  }, []);

  // Display year when hovering, current time otherwise - memoized for performance
  const displayTime = useMemo(() => {
    try {
      return formatDisplayTime(hoveredProject, currentTime);
    } catch (error) {
      return hoveredProject ? hoveredProject.year.toString() : '00:00:00';
    }
  }, [hoveredProject, currentTime]);

  // Determine which target name parts to use
  // Use hover-based name parts after welcome transition, otherwise use welcome transition name parts
  const targetNameParts = welcomeTransitionComplete ? hoverTargetNameParts : welcomeTargetNameParts;

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
        <HeroSection
          welcomeTransitionComplete={welcomeTransitionComplete}
          shouldScrambleFromWelcome={shouldScrambleFromWelcome}
          targetNameParts={targetNameParts}
          hoveredProject={hoveredProject}
          displayTime={displayTime}
          retriggerKey={retriggerKey}
        />

        <ProjectsList
          projects={projects}
          welcomeTransitionComplete={welcomeTransitionComplete}
          hoveredCardId={hoveredCardId}
          onProjectMouseEnter={handleProjectMouseEnter}
          onProjectMouseLeave={handleProjectMouseLeave}
        />
      </div>
      {/* Footer at bottom of content */}
      <Footer showFooter={showFooter} />
    </motion.section>
  );
};

// Memoize MainContent to prevent unnecessary re-renders
export default memo(MainContent);
