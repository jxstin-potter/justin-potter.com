import { Variants } from 'framer-motion';

// Consistent easing curve used throughout the application
export const EASING = [0.25, 0.1, 0.25, 1] as const;

// Standard animation durations
export const DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
} as const;

// Container animation variants - for staggered children
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Hover animation variants - consistent across all components
// Optimized: reduced keyframes for better performance
export const hoverAnimationVariants: Variants = {
  initial: {
    opacity: 1,
    scale: 1,
  },
  animate: {
    opacity: [1, 0.6, 1],
    scale: [1, 1.01, 1],
    transition: {
      duration: DURATION.normal,
      times: [0, 0.5, 1],
      ease: EASING,
      // Use will-change for better performance
    },
  },
};

// Subtitle animation variants - for secondary text
export const subtitleVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.8,
      duration: DURATION.slow,
      ease: EASING,
    },
  },
};

// Fade in animation variants
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.slow,
      ease: EASING,
    },
  },
};

// Slide in from right (for project cards)
export const slideInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION.slow,
      ease: EASING,
    },
  },
};

// Projects container animation - coordinates with welcome transition
export const projectsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING,
      delay: 0.2,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Professional project card animation variant
// Seamlessly integrated with container stagger pattern
export const projectCardVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
    y: 15,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASING,
    },
  },
};

// Standard transition for hover effects
export const hoverTransition = {
  duration: DURATION.fast,
  ease: EASING,
};

// Standard transition for project card hover
export const projectCardHover = {
  scale: 1.01,
  transition: hoverTransition,
};
