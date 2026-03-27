import React, { useRef } from "react";
import OptimizedImage from "../common/OptimizedImage";
import commerceflowTasksImage from "../../assets/2du-tasks.png";
import commerceflowLoginImage from "../../assets/2du-login.png";
import commerceflowSettingsImage from "../../assets/2du-settings.png";

interface ProjectDetailHeroProps {
  title: string;
  role: string;
  summary: string;
  description: string;
  imageUrl?: string;
  children?: React.ReactNode;
  isCommerceflow?: boolean;
  showCommerceflowStackImages?: boolean;
  placeholderCount?: number;
  galleryImages?: Array<{
    src: string;
    label: string;
    objectPosition?: string;
    imageScale?: number;
  }>;
}

const commerceflowStackImages = [
  { src: commerceflowTasksImage, label: "Tasks / Inbox" },
  { src: commerceflowLoginImage, label: "Login" },
  { src: commerceflowSettingsImage, label: "Settings" },
] as const;

const ProjectDetailHero: React.FC<ProjectDetailHeroProps> = ({
  title,
  role,
  summary,
  description,
  imageUrl,
  children,
  isCommerceflow = false,
  showCommerceflowStackImages = false,
  placeholderCount = 4,
  galleryImages,
}) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const stackImages = galleryImages ?? [];
  const shouldRenderGalleryStack = stackImages.length > 0;

  return (
    <section className="project-detail-hero" ref={heroRef}>
      <div
        className={`project-detail-hero-text${isCommerceflow ? " project-detail-hero-text-sticky" : ""}`}
        ref={textRef}
      >
        <h1 className="project-detail-title" ref={titleRef}>
          {title}
        </h1>
        {!isCommerceflow && <p className="project-detail-role">{role}</p>}
        {children && <div className="project-detail-meta">{children}</div>}
        <p className="project-detail-summary">{summary}</p>
        <p className="project-detail-description">{description}</p>
      </div>
      {isCommerceflow || shouldRenderGalleryStack ? (
        <div
          className="project-detail-hero-media project-detail-hero-media-stack"
          ref={mediaRef}
        >
          <div className="project-detail-hero-stack">
            {isCommerceflow
              ? Array.from({ length: placeholderCount }).map((_, index) => {
                  const stackImage = showCommerceflowStackImages
                    ? commerceflowStackImages[index]
                    : undefined;

                  return (
                    <div
                      key={`commerceflow-stack-${index}`}
                      className="project-detail-hero-stack-card"
                    >
                      {stackImage ? (
                        <OptimizedImage
                          src={stackImage.src}
                          alt={`${title} - ${stackImage.label}`}
                          priority={true}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : null}
                    </div>
                  );
                })
              : stackImages.map((image, index) => (
                  <div
                    key={`${title}-stack-${index}`}
                    className="project-detail-hero-stack-card"
                  >
                    <OptimizedImage
                      src={image.src}
                      alt={`${title} - ${image.label}`}
                      priority={index === 0}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: image.objectPosition ?? "top center",
                        transform:
                          typeof image.imageScale === "number"
                            ? `scale(${image.imageScale})`
                            : undefined,
                        transformOrigin: "center center",
                      }}
                    />
                  </div>
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
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "2px",
              }}
            />
          </div>
        )
      )}
    </section>
  );
};

export default ProjectDetailHero;
