export interface ProjectData {
  title: string;
  role: string;
  year: number;
}

/**
 * One picture in every format the site ships.
 *
 * `src` is the JPEG the <img> falls back to; `webpSrc` and `avifSrc` are
 * offered to <picture> ahead of it. Keeping the three together means a call
 * site cannot accidentally pass a WebP url where an AVIF one belongs.
 */
export interface ImageAsset {
  src: string;
  webpSrc: string;
  avifSrc: string;
}
