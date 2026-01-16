import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ScrambleText from '../animations/ScrambleText';
import { DURATION, EASING } from '../../utils/animations';
import { ProjectData } from '../../types';

interface HeroMetaProps {
  welcomeTransitionComplete: boolean;
  shouldScrambleFromWelcome: boolean;
  hoveredProject: ProjectData | null;
  displayTime: string;
  retriggerKey: number;
}

const HeroMeta: React.FC<HeroMetaProps> = ({
  welcomeTransitionComplete,
  shouldScrambleFromWelcome: _shouldScrambleFromWelcome,
  hoveredProject,
  displayTime,
  retriggerKey,
}) => {
  const metaRef = useRef<HTMLDivElement | null>(null);
  const roleRef = useRef<HTMLDivElement | null>(null);
  const [roleIntroScrambleKey, setRoleIntroScrambleKey] = useState(0);
  const roleIntroTriggeredRef = useRef(false);
  const getRoleParts = (role: string): [string, string] => {
    const normalized = role.trim().toUpperCase();
    if (!normalized) {
      return ['DESIGNER &', 'DEVELOPER'];
    }

    if (normalized.includes('&')) {
      const parts = normalized
        .split('&')
        .map((part) => part.trim())
        .filter(Boolean);
      return [parts[0] ?? normalized, parts.slice(1).join(' & ')];
    }

    const words = normalized.split(/\s+/).filter(Boolean);
    if (words.length <= 1) {
      return [normalized, ''];
    }

    const splitIndex = Math.ceil(words.length / 2);
    return [words.slice(0, splitIndex).join(' '), words.slice(splitIndex).join(' ')];
  };

  const roleParts = hoveredProject
    ? getRoleParts(hoveredProject.role)
    : ['DESIGNER &', 'DEVELOPER'];
  const locationTarget = hoveredProject ? hoveredProject.year.toString() : 'BROOKLYN, NY';
  const locationIsActive = welcomeTransitionComplete || !!hoveredProject;
  const roleRevealDelay = 0;
  const roleLine1Text = welcomeTransitionComplete ? 'DESIGNER &' : ' ';
  const roleLine2Text = welcomeTransitionComplete ? 'DEVELOPER' : ' ';
  const roleLine1Target =
    welcomeTransitionComplete && hoveredProject ? roleParts[0] : undefined;
  const roleLine2Target =
    welcomeTransitionComplete && hoveredProject ? roleParts[1] : undefined;
  const roleHoverActive = welcomeTransitionComplete && !!hoveredProject;

  useEffect(() => {
    if (welcomeTransitionComplete && !roleIntroTriggeredRef.current) {
      setRoleIntroScrambleKey((prev) => prev + 1);
      roleIntroTriggeredRef.current = true;
    }
    if (!welcomeTransitionComplete) {
      roleIntroTriggeredRef.current = false;
    }
  }, [welcomeTransitionComplete]);

  return (
    <div
      className="hero-meta-wrapper"
      ref={metaRef}
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
        transform: 'translate(15rem, 15rem)',
        position: 'relative'
      }}
    >
      {/* Designer & Developer / Design & Development - Second column, first row */}
      <motion.div
        ref={roleRef}
        initial={false}
        animate={{ opacity: welcomeTransitionComplete ? 1 : 0 }}
        transition={{
          delay: welcomeTransitionComplete ? roleRevealDelay : 0,
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
          marginLeft: '-0.5rem',
          flexShrink: 0,
          pointerEvents: welcomeTransitionComplete ? 'auto' : 'none'
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
                display: 'inline-block',
                width: 'max-content',
                minWidth: 'max-content'
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
                  height: '1.2em',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
                aria-hidden="true"
              >
                {hoveredProject ? hoveredProject.role.toUpperCase() : 'DESIGNER & DEVELOPER'}
              </span>
              {/* Spacer for DESIGNER DEVELOPER (without &) - also in normal flow for width calculation */}
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
                  height: '1.2em',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
                aria-hidden="true"
              >
                DESIGNER DEVELOPER
              </span>
              {/* Two-line layout: DESIGNER & on first line, DEVELOPER on second line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 0
                }}
              >
                {/* First line: DESIGNER & */}
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
                    height: '1.2em'
                  }}
                >
                  <ScrambleText
                    text={roleLine1Text}
                    targetText={roleLine1Target}
                    isHovered={roleHoverActive}
                    scrambleDuration={450}
                    preserveSpaces={true}
                    style={{ display: 'inline-block' }}
                    retriggerKey={retriggerKey + roleIntroScrambleKey}
                  />
                </p>
                {/* Second line: DEVELOPER */}
                {roleParts[1] && (
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
                      height: '1.2em'
                    }}
                  >
                    <ScrambleText
                      text={roleLine2Text}
                      targetText={roleLine2Target}
                      isHovered={roleHoverActive}
                      scrambleDuration={450}
                      preserveSpaces={true}
                      style={{ display: 'inline-block' }}
                      retriggerKey={retriggerKey + roleIntroScrambleKey}
                    />
                  </p>
                )}
              </div>
            </div>
          </div>
      </motion.div>

      {/* Location/Time - PORTFOLIO 2026 scrambles into BROOKLYN, NY */}
      <div
        style={{
          fontSize: '0.875rem',
          fontWeight: 400,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 0,
          minWidth: '137px',
          flexShrink: 0,
          marginLeft: '2.5rem'
        }}
      >
        <div
          style={{
            position: 'relative',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            textAlign: 'right'
          }}
        >
          {/* Width lock to keep PORTFOLIO/BROOKLYN aligned */}
          <span
            style={{
              visibility: 'hidden',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              height: '1.2em'
            }}
            aria-hidden="true"
          >
            BROOKLYN, NY
          </span>
          <span
            style={{
              position: 'static',
              top: 0,
              right: 0,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              transform: 'none',
              marginLeft: '-7.3rem'
            }}
          >
            <ScrambleText
              text="PORTFOLIO 2026"
              targetText={welcomeTransitionComplete ? locationTarget : undefined}
              isHovered={locationIsActive}
                      scrambleDuration={450}
              iterations={8}
              preserveSpaces={true}
              retriggerKey={retriggerKey}
            />
          </span>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{
            opacity: welcomeTransitionComplete && !hoveredProject ? 1 : 0,
          }}
          transition={{ duration: DURATION.fast, ease: EASING }}
          style={{ lineHeight: 1.2, whiteSpace: 'nowrap' }}
        >
          {displayTime}
        </motion.span>
      </div>
    </div>
  );
};

export default HeroMeta;
