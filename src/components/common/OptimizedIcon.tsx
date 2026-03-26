import React from "react";
import OptimizedImage, { OptimizedImageProps } from "./OptimizedImage";

export interface OptimizedIconProps extends Omit<
  OptimizedImageProps,
  "src" | "alt"
> {
  src: string;
  alt: string;
  size?: number | string; // Icon size in pixels or CSS value
  webpSrc?: string;
  avifSrc?: string;
}

/**
 * OptimizedIcon component for small icons (email, social media, etc.)
 * Automatically handles WebP/AVIF conversion and provides proper sizing
 *
 * Usage:
 * <OptimizedIcon
 *   src="/icons/email.png"
 *   webpSrc="/icons/email.webp"
 *   alt="Email icon"
 *   size={24}
 * />
 */
const OptimizedIcon: React.FC<OptimizedIconProps> = ({
  src,
  alt,
  size = 24,
  webpSrc,
  avifSrc,
  style,
  ...rest
}) => {
  const sizeValue = typeof size === "number" ? `${size}px` : size;

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      webpSrc={webpSrc}
      avifSrc={avifSrc}
      priority={true} // Icons are small, load immediately
      style={{
        width: sizeValue,
        height: sizeValue,
        objectFit: "contain",
        display: "block",
        ...style,
      }}
      {...rest}
    />
  );
};

export default OptimizedIcon;
