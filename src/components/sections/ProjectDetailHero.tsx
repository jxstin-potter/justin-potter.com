import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const logLayout = (reason: string) => {
      const heroRect = heroRef.current?.getBoundingClientRect();
      const textRect = textRef.current?.getBoundingClientRect();
      const mediaRect = mediaRef.current?.getBoundingClientRect();
      const titleRect = titleRef.current?.getBoundingClientRect();
      const titleOverlapsMedia = Boolean(
        titleRect &&
          mediaRect &&
          titleRect.right > mediaRect.left &&
          titleRect.left < mediaRect.right
      );
      const textOverlapsMedia = Boolean(
        textRect &&
          mediaRect &&
          textRect.right > mediaRect.left &&
          textRect.left < mediaRect.right
      );
      const mediaStyles = mediaRef.current ? window.getComputedStyle(mediaRef.current) : null;
      const textStyles = textRef.current ? window.getComputedStyle(textRef.current) : null;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProjectDetailHero.tsx',message:'project-detail layout snapshot',data:{reason,hero:heroRect,text:textRect,media:mediaRect,title:titleRect,titleOverlapsMedia,textOverlapsMedia,mediaStyle:mediaStyles ? {position:mediaStyles.position,zIndex:mediaStyles.zIndex,overflow:mediaStyles.overflow} : null,textStyle:textStyles ? {position:textStyles.position,zIndex:textStyles.zIndex} : null,viewport:{w:window.innerWidth,h:window.innerHeight}},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    };

    logLayout('mount');
    const handleResize = () => logLayout('resize');
    window.addEventListener('resize', handleResize);
    const observer = new ResizeObserver(() => logLayout('resize-observer'));
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

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
