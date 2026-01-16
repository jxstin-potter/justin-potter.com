import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants } from '../../utils/animations';
import HeroName from './HeroName';
import HeroMeta from './HeroMeta';
import { ProjectData } from '../../types';

interface HeroSectionProps {
  welcomeTransitionComplete: boolean;
  shouldScrambleFromWelcome: boolean;
  targetNameParts: [string, string];
  hoveredProject: ProjectData | null;
  displayTime: string;
  retriggerKey: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  welcomeTransitionComplete,
  shouldScrambleFromWelcome,
  targetNameParts,
  hoveredProject,
  displayTime,
  retriggerKey,
}) => {
  return (
    <div
      className="hero-section-container"
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
        className="hero-container"
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
        <HeroName
          welcomeTransitionComplete={welcomeTransitionComplete}
          shouldScrambleFromWelcome={shouldScrambleFromWelcome}
          targetNameParts={targetNameParts}
          hoveredProject={hoveredProject}
          retriggerKey={retriggerKey}
        />
        <HeroMeta
          welcomeTransitionComplete={welcomeTransitionComplete}
          shouldScrambleFromWelcome={shouldScrambleFromWelcome}
          hoveredProject={hoveredProject}
          displayTime={displayTime}
          retriggerKey={retriggerKey}
        />
      </motion.div>
    </div>
  );
};

export default HeroSection;
