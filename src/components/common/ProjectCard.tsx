import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { hoverTransition, DURATION, EASING } from '../../utils/animations';
import ScrambleText from '../animations/ScrambleText';
import OptimizedImage from './OptimizedImage';
import { ProjectSummary } from '../../data/projects';

const MotionLink = motion(Link);

interface ProjectCardProps {
  project: ProjectSummary;
  index: number;
  isHovered: boolean;
  isAnyCardHovered: boolean;
  onProjectMouseEnter: (project: ProjectSummary) => void;
  comingSoonIds: { min: number; max: number };
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  isHovered,
  isAnyCardHovered,
  onProjectMouseEnter,
  comingSoonIds,
}) => {
  const isComingSoon = project.id >= comingSoonIds.min && project.id <= comingSoonIds.max;

  return (
    <MotionLink
      key={project.id}
      to={`/projects/${project.slug}`}
      initial={{ opacity: 0, x: 50, y: 15 }}
      animate={{
        opacity: isAnyCardHovered && !isHovered ? 0.85 : 1,
        x: 0,
        y: 0,
      }}
      data-project-id={project.id}
      className="bracket-hover"
      onMouseEnter={() => onProjectMouseEnter(project)}
      transition={{
        opacity: { duration: DURATION.slow, ease: EASING },
        x: { duration: DURATION.slow, ease: EASING },
        y: { duration: DURATION.fast, ease: EASING },
      }}
      style={{
        minWidth: 'min(325px, calc(100vw - 2rem))',
        maxWidth: 'min(325px, calc(100vw - 2rem))',
        scrollSnapAlign: 'start',
        flexShrink: 0,
        position: 'relative',
        pointerEvents: 'auto',
        cursor: 'pointer',
        textDecoration: 'none',
        alignSelf: 'flex-end',
        willChange: 'transform, opacity',
      }}
      aria-label={`View project: ${project.title}`}
    >
      <motion.div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'calc(var(--spacing-xs) + 10px)',
        }}
      >
      {/* Project Image */}
      <motion.div
        initial={{}}
        animate={{
          filter: isAnyCardHovered && !isHovered ? 'blur(4px)' : 'blur(0px)',
          clipPath: isAnyCardHovered && !isHovered
            ? 'inset(14% 0% 0% 0%)'
            : 'inset(0% 0% 0% 0%)',
        }}
        transition={{
          duration: DURATION.fast,
          ease: EASING,
          clipPath: { duration: DURATION.fast, ease: EASING },
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        style={{
          width: '100%',
          height: '213px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'var(--dark-grey)',
          flexShrink: 0,
          zIndex: 1,
          pointerEvents: 'auto',
          borderRadius: '4.5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform, filter',
          transform: 'translateZ(0)',
          WebkitClipPath: isAnyCardHovered && !isHovered
            ? 'inset(14% 0% 0% 0%)'
            : 'inset(0% 0% 0% 0%)',
        }}
      >
        {isComingSoon ? (
          <motion.div
            style={{
              fontSize: '1.5rem',
              fontWeight: 400,
              color: 'var(--medium-grey)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            COMING SOON
          </motion.div>
        ) : (
          <>
            <OptimizedImage
              src={project.imageUrl}
              alt={project.title}
              priority={false}
              whileHover={{
                filter: 'brightness(1.1)',
                transition: { duration: DURATION.fast, ease: EASING },
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'filter var(--motion-duration-normal) var(--motion-ease-standard)',
              }}
            />
            {/* Overlay on hover */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.fast, ease: EASING }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.1) 100%)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </>
        )}
      </motion.div>
      {/* Project Number and View Link */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: '-0.55rem',
        }}
      >
        <div
          style={{
            fontSize: '0.65rem',
            color: 'var(--medium-grey)',
            fontFamily: '"JetBrains Mono", "Fira Code", var(--font-mono)',
            fontVariantNumeric: 'slashed-zero',
            fontFeatureSettings: '"zero" 1',
            letterSpacing: '0.1em',
            opacity: 0.9,
            marginTop: '-30px',
          }}
        >
          <span className="bracket">[</span>
          {String(index + 1).padStart(2, '0')}
          <span className="bracket">]</span>
        </div>
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : -10,
          }}
          whileHover={{
            color: 'var(--lime-green)',
            x: isHovered ? 5 : 0,
          }}
          transition={hoverTransition}
          style={{
            fontSize: '0.75rem',
            color: 'var(--primary-white)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            pointerEvents: 'none',
            marginTop: '-0.75px',
            transition: 'color var(--motion-duration-fast) var(--motion-ease-standard)',
          }}
        >
          <ScrambleText
            text="View Project →"
            isHovered={isHovered}
            scrambleDuration={180}
            iterations={4}
            preserveSpaces={true}
          />
        </motion.span>
      </div>
      </motion.div>
    </MotionLink>
  );
};

export default memo(ProjectCard);
