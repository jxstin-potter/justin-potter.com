import React from 'react';
import ScrambleText from '../animations/ScrambleText';
import { ProjectData } from '../../types';

interface HeroNameProps {
  welcomeTransitionComplete: boolean;
  shouldScrambleFromWelcome: boolean;
  targetNameParts: [string, string];
  hoveredProject: ProjectData | null;
  retriggerKey: number;
}

const HeroName: React.FC<HeroNameProps> = ({
  welcomeTransitionComplete,
  shouldScrambleFromWelcome,
  targetNameParts,
  hoveredProject,
  retriggerKey,
}) => {
  return (
    <div 
      className="hero-name-container"
      role="banner"
      aria-label="Portfolio name"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        overflow: 'visible',
        gridColumn: '1',
        gridRow: '1 / 3',
        position: 'relative',
        transform: 'translateY(3rem)'
      }}
    >
      {/* Hidden spacers in normal flow to reserve space for layout stability */}
      <>
        <h1
          style={{
            fontSize: 'clamp(3rem, 10.5vw, 8.5rem)',
            fontWeight: 450,
            lineHeight: 0.85,
            letterSpacing: '-0.03em',
            margin: 0,
            fontFamily: 'var(--font-primary)',
            textTransform: 'uppercase',
            visibility: 'hidden',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}
          aria-hidden="true"
        >
          COMMERCE
        </h1>
        <h1
          style={{
            fontSize: 'clamp(3rem, 10.5vw, 8.5rem)',
            fontWeight: 450,
            lineHeight: 0.85,
            letterSpacing: '-0.03em',
            margin: 0,
            fontFamily: 'var(--font-primary)',
            textTransform: 'uppercase',
            visibility: 'hidden',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}
          aria-hidden="true"
        >
          FLOW
        </h1>
      </>
      {!welcomeTransitionComplete ? (
        // Single entity scramble: WELCOME -> JUSTIN (as one animation)
        <>
          <h1
            aria-label="Welcome"
            style={{
              fontSize: 'clamp(3rem, 10.5vw, 8.5rem)',
              fontWeight: 450,
              lineHeight: 0.85,
              letterSpacing: '-0.03em',
              color: 'var(--primary-white)',
              margin: 0,
              fontFamily: 'var(--font-primary)',
              textTransform: 'uppercase',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          >
            <ScrambleText
              text="WELCOME"
              targetText={shouldScrambleFromWelcome ? "JUSTIN" : undefined}
              isHovered={shouldScrambleFromWelcome}
              scrambleDuration={300}
              iterations={8}
              preserveSpaces={true}
              retriggerKey={retriggerKey}
            />
          </h1>
          {/* Hidden spacer to reserve space for POTTER on mobile - prevents layout shift */}
          {!welcomeTransitionComplete && (
            <h1
              className="name-spacer-mobile"
              style={{
                fontSize: 'clamp(3rem, 10.5vw, 8.5rem)',
                fontWeight: 450,
                lineHeight: 0.85,
                letterSpacing: '-0.03em',
                margin: 0,
                fontFamily: 'var(--font-primary)',
                textTransform: 'uppercase',
                position: 'relative',
                visibility: 'hidden',
                height: 'auto',
                pointerEvents: 'none',
                flexShrink: 0
              }}
              aria-hidden="true"
            >
              POTTER
            </h1>
          )}
        </>
      ) : (
        // Two-part system for project hovers (after welcome transition)
        <>
          <h1
            aria-label={hoveredProject ? `Project: ${hoveredProject.title}` : "Justin"}
            style={{
              fontSize: 'clamp(3rem, 10.5vw, 8.5rem)',
              fontWeight: 450,
              lineHeight: 0.85,
              letterSpacing: '-0.03em',
              color: 'var(--primary-white)',
              margin: 0,
              fontFamily: 'var(--font-primary)',
              textTransform: 'uppercase',
              position: 'absolute',
              top: 0,
              left: 0
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
              aria-label={hoveredProject ? `Project year: ${hoveredProject.year}` : "Potter"}
              style={{
                fontSize: 'clamp(3rem, 10.5vw, 8.5rem)',
                fontWeight: 450,
                lineHeight: 0.85,
                letterSpacing: '-0.03em',
                color: 'var(--primary-white)',
                margin: 0,
                fontFamily: 'var(--font-primary)',
                textTransform: 'uppercase',
                position: 'absolute',
                top: 'calc(clamp(3rem, 10.5vw, 8.5rem) * 0.85)',
                left: 0
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
  );
};

export default HeroName;
