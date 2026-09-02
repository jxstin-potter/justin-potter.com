import React, { useRef } from "react";
import OptimizedImage from "../common/OptimizedImage";
import { ImageAsset } from "../../types";
import { twoDuTasks, twoDuLogin, twoDuSettings } from "../../data/images";

interface ProjectDetailHeroProps {
  title: string;
  role: string;
  summary: string;
  description: string;
  image?: ImageAsset;
  children?: React.ReactNode;
  isCommerceflow?: boolean;
  showCommerceflowStackImages?: boolean;
  placeholderCount?: number;
  galleryImages?: Array<{
    image: ImageAsset;
    label: string;
    objectPosition?: string;
    imageScale?: number;
  }>;
}

const commerceflowStackImages = [
  { image: twoDuTasks, label: "Tasks / Inbox" },
  { image: twoDuLogin, label: "Login" },
  { image: twoDuSettings, label: "Settings" },
] as const;

const ProjectDetailHero: React.FC<ProjectDetailHeroProps> = ({
  title,
  role,
  summary,
  description,
  image,
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
                          {...stackImage.image}
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
              : stackImages.map((galleryItem, index) => (
                  <div
                    key={`${title}-stack-${index}`}
                    className="project-detail-hero-stack-card"
                  >
                    <OptimizedImage
                      {...galleryItem.image}
                      alt={`${title} - ${galleryItem.label}`}
                      priority={index === 0}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition:
                          galleryItem.objectPosition ?? "top center",
                        transform:
                          typeof galleryItem.imageScale === "number"
                            ? `scale(${galleryItem.imageScale})`
                            : undefined,
                        transformOrigin: "center center",
                      }}
                    />
                  </div>
                ))}
          </div>
        </div>
      ) : (
        image && (
          <div className="project-detail-hero-media" ref={mediaRef}>
            <OptimizedImage
              {...image}
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
