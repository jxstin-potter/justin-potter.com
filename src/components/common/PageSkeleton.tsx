import React from 'react';
import SkeletonLoader from './SkeletonLoader';

const PageSkeleton: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: 'var(--spacing-lg)',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
      aria-label="Loading page content"
      role="status"
    >
      {/* Hero skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <SkeletonLoader width="60%" height="4rem" />
        <SkeletonLoader width="40%" height="4rem" />
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          <SkeletonLoader width="150px" height="1.5rem" />
          <SkeletonLoader width="150px" height="1.5rem" />
        </div>
      </div>

      {/* Content skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <SkeletonLoader width="80%" height="2rem" />
        <SkeletonLoader width="100%" height="1rem" />
        <SkeletonLoader width="90%" height="1rem" />
        <SkeletonLoader width="70%" height="1rem" />
      </div>
    </div>
  );
};

export default PageSkeleton;
