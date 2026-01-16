/**
 * Image optimization utilities
 * Helps generate WebP/AVIF paths and manage image optimization
 */

/**
 * Generates WebP and AVIF paths from a source image path
 * Assumes images are in the same directory with different extensions
 * 
 * @param src - Original image path (e.g., '/assets/photo.png')
 * @returns Object with webpSrc and avifSrc paths
 * 
 * @example
 * const { webpSrc, avifSrc } = getOptimizedImagePaths('/assets/photo.png');
 * // Returns: { webpSrc: '/assets/photo.webp', avifSrc: '/assets/photo.avif' }
 */
export const getOptimizedImagePaths = (src: string): { webpSrc?: string; avifSrc?: string } => {
  // For imported images (webpack/bundler), we can't easily generate paths
  // These will need to be manually imported or converted at build time
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return {};
  }

  // Extract extension and base path
  const lastDot = src.lastIndexOf('.');
  if (lastDot === -1) return {};

  const basePath = src.substring(0, lastDot);
  const extension = src.substring(lastDot + 1).toLowerCase();

  // Only generate paths for common image formats
  if (!['png', 'jpg', 'jpeg', 'gif'].includes(extension)) {
    return {};
  }

  return {
    webpSrc: `${basePath}.webp`,
    avifSrc: `${basePath}.avif`,
  };
};

/**
 * Checks if the browser supports AVIF format
 */
export const supportsAVIF = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = () => resolve(true);
    avif.onerror = () => resolve(false);
    avif.src =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

/**
 * Checks if the browser supports WebP format
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webp = new Image();
    webp.onload = () => resolve(true);
    webp.onerror = () => resolve(false);
    webp.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Preloads an image to improve perceived performance
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Generates a low-quality placeholder (LQIP) data URL
 * This can be used as a blur-up placeholder
 */
export const generatePlaceholder = (width: number = 20, height: number = 20): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
    </svg>
  `.trim();
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
