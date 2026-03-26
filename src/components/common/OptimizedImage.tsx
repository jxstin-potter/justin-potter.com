import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { DURATION, EASING_CSS } from "../../utils/animations";

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  webpSrc?: string;
  avifSrc?: string;
  srcSet?: string;
  sizes?: string;
  placeholder?: string;
  priority?: boolean; // If true, load immediately without lazy loading
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
  style?: React.CSSProperties;
  whileHover?: any; // Framer Motion hover props
}

/**
 * OptimizedImage component with WebP/AVIF support, lazy loading, and fallbacks
 *
 * Usage:
 * <OptimizedImage
 *   src="/images/photo.png"
 *   webpSrc="/images/photo.webp"
 *   avifSrc="/images/photo.avif"
 *   alt="Description"
 *   priority={false}
 * />
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  webpSrc,
  avifSrc,
  srcSet,
  sizes,
  placeholder,
  priority = false,
  onLoad,
  onError,
  className,
  style,
  whileHover,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Use IntersectionObserver for lazy loading (unless priority is true)
  const [containerRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
    triggerOnce: true,
  });

  // Ensure hover-animated images load even without wrapper sizing.
  const shouldLoad = priority || isIntersecting || Boolean(whileHover);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (shouldLoad && !isLoaded && !hasError) {
      // Preload the image
      const img = new Image();
      img.onload = () => {
        setIsLoaded(true);
        onLoad?.();
      };
      img.onerror = () => {
        setHasError(true);
        onError?.();
      };

      // Try AVIF first, then WebP, then fallback
      if (avifSrc) {
        img.src = avifSrc;
      } else if (webpSrc) {
        img.src = webpSrc;
      } else {
        img.src = src;
      }
    }
  }, [shouldLoad, isLoaded, hasError, src, webpSrc, avifSrc, onLoad, onError]);

  // Generate srcset for responsive images
  const generateSrcSet = () => {
    if (srcSet) return srcSet;

    // Auto-generate srcset if webpSrc or avifSrc provided
    if (webpSrc || avifSrc) {
      const baseSrc = webpSrc || avifSrc || src;
      return `${baseSrc} 1x, ${baseSrc.replace(".webp", "@2x.webp").replace(".avif", "@2x.avif")} 2x`;
    }

    return undefined;
  };

  const imageStyle: React.CSSProperties = {
    opacity: isLoaded ? 1 : placeholder ? 0.5 : 0,
    transition: `opacity ${DURATION.normal}s ${EASING_CSS}`,
    ...style,
  };

  // If priority is true or whileHover is provided, don't use wrapper (for Framer Motion compatibility)
  const useWrapper = !priority && !whileHover;

  const containerStyle: React.CSSProperties = {
    display: "inline-block",
    position: "relative",
    ...(style?.width ? { width: style.width } : {}),
    ...(style?.height ? { height: style.height } : {}),
  };

  // Base image props that are safe for both regular img and motion.img
  const baseImgProps = {
    src: shouldLoad
      ? src
      : placeholder ||
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E',
    srcSet: shouldLoad ? generateSrcSet() : undefined,
    sizes,
    className,
    style: imageStyle,
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding: "async" as const,
    onLoad: () => {
      if (!isLoaded) {
        setIsLoaded(true);
        onLoad?.();
      }
    },
    onError: () => {
      if (!hasError) {
        setHasError(true);
        onError?.();
      }
    },
  };

  const pictureContent = (
    <picture style={{ display: "block", width: "100%", height: "100%" }}>
      {/* AVIF source (best compression) */}
      {avifSrc && shouldLoad && (
        <source srcSet={generateSrcSet()} type="image/avif" sizes={sizes} />
      )}

      {/* WebP source (good compression, wider support) */}
      {webpSrc && shouldLoad && (
        <source srcSet={generateSrcSet()} type="image/webp" sizes={sizes} />
      )}

      {/* Fallback image */}
      {whileHover ? (
        <motion.img
          ref={imgRef}
          alt={alt}
          {...baseImgProps}
          whileHover={whileHover}
        />
      ) : (
        <img ref={imgRef} alt={alt} {...baseImgProps} {...rest} />
      )}

      {/* Placeholder/loading state */}
      {placeholder && !isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(10px)",
            opacity: 0.5,
            zIndex: -1,
          }}
        />
      )}
    </picture>
  );

  // If using wrapper, wrap in div for IntersectionObserver
  if (useWrapper) {
    return (
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        style={containerStyle}
      >
        {pictureContent}
      </div>
    );
  }

  // Otherwise, use a span for ref (invisible, just for observation)
  return (
    <>
      <span
        ref={containerRef as React.RefObject<HTMLSpanElement>}
        style={{ display: "none" }}
        aria-hidden="true"
      />
      {pictureContent}
    </>
  );
};

export default OptimizedImage;
