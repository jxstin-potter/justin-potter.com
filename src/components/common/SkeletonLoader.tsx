import React from 'react';
import { motion } from 'framer-motion';
import { EASING } from '../../utils/animations';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
  className = '',
}) => {
  return (
    <motion.div
      className={`skeleton-loader ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: EASING,
      }}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--dark-grey)',
      }}
      aria-label="Loading"
      role="status"
    />
  );
};

export default SkeletonLoader;
