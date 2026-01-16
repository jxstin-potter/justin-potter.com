import React, { useRef } from 'react';
import OptimizedImage from '../common/OptimizedImage';

interface ProjectDetailHeroProps {
  title: string;
  role: string;
  summary: string;
  description: string;
  imageUrl?: string;
  children?: React.ReactNode;
  isCommerceflow?: boolean;
  placeholderCount?: number;
}

const ProjectDetailHero: React.FC<ProjectDetailHeroProps> = ({
  title,
  role,
  summary,
  description,
  imageUrl,
  children,
  isCommerceflow = false,
  placeholderCount = 4,
}) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  return (
    <section className="project-detail-hero" ref={heroRef}>
      <div
        className={`project-detail-hero-text${isCommerceflow ? ' project-detail-hero-text-sticky' : ''}`}
        ref={textRef}
      >
        <h1 className="project-detail-title" ref={titleRef}>{title}</h1>
        {!isCommerceflow && <p className="project-detail-role">{role}</p>}
        {children && <div className="project-detail-meta">{children}</div>}
        <p className="project-detail-summary">{summary}</p>
        <p className="project-detail-description">{description}</p>
      </div>
      {isCommerceflow ? (
        <div className="project-detail-hero-media project-detail-hero-media-stack" ref={mediaRef}>
          <div className="project-detail-hero-stack">
            {Array.from({ length: placeholderCount }).map((_, index) => (
              <div key={`commerceflow-stack-${index}`} className="project-detail-hero-stack-card" />
            ))}
          </div>
        </div>
      ) : (
        imageUrl && (
          <div className="project-detail-hero-media" ref={mediaRef}>
            <OptimizedImage
              src={imageUrl}
              alt={`${title} hero`}
              priority={true}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '2px',
              }}
            />
          </div>
        )
      )}
    </section>
  );
};

export default ProjectDetailHero;
