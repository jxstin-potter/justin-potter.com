import React, { useRef } from "react";
import OptimizedImage from "../common/OptimizedImage";
import { ImageAsset } from "../../types";

/** One screenshot in a project's hero stack. */
export interface HeroStackImage {
  image: ImageAsset;
  label: string;
  objectPosition?: string;
  imageScale?: number;
  /**
   * Cards are a fixed 1919/989 so a stack of screenshots reads as one column,
   * and `cover` trims the few percent each source is off by. A source whose
   * shape is genuinely different loses real content to that crop - the 2.29:1
   * KeyVault capture was giving up 17.8% of its width, taking the logo and the
   * sign-up button with it. `natural` drops the fixed ratio for that one card
   * and lets the image set its own height, so nothing is cropped whatever the
   * asset's dimensions turn out to be.
   */
  fit?: "cover" | "natural";
}

interface ProjectDetailHeroProps {
  title: string;
  role: string;
  summary: string;
  description: string;
  image?: ImageAsset;
  children?: React.ReactNode;
  isStackedHero?: boolean;
  galleryImages?: HeroStackImage[];
}

const ProjectDetailHero: React.FC<ProjectDetailHeroProps> = ({
  title,
  role,
  summary,
  description,
  image,
  children,
  isStackedHero = false,
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
        className={`project-detail-hero-text${isStackedHero ? " project-detail-hero-text-sticky" : ""}`}
        ref={textRef}
      >
        <h1 className="project-detail-title" ref={titleRef}>
          {title}
        </h1>
        {!isStackedHero && <p className="project-detail-role">{role}</p>}
        {children && <div className="project-detail-meta">{children}</div>}
        <p className="project-detail-summary">{summary}</p>
        <p className="project-detail-description">{description}</p>
      </div>
      {shouldRenderGalleryStack ? (
        <div
          className="project-detail-hero-media project-detail-hero-media-stack"
          ref={mediaRef}
        >
          <div className="project-detail-hero-stack">
            {stackImages.map((galleryItem, index) => {
              const isNatural = galleryItem.fit === "natural";

              return (
                <div
                  key={`${title}-stack-${index}`}
                  className="project-detail-hero-stack-card"
                  style={
                    isNatural
                      ? { aspectRatio: "auto", maxHeight: "none" }
                      : undefined
                  }
                >
                  <OptimizedImage
                    {...galleryItem.image}
                    alt={`${title} - ${galleryItem.label}`}
                    priority={index === 0}
                    style={
                      isNatural
                        ? { width: "100%", height: "auto", display: "block" }
                        : {
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
                          }
                    }
                  />
                </div>
              );
            })}
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
