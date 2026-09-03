import { ImageAsset } from "../types";

/**
 * Every picture, in every format we ship.
 *
 * Each asset is generated from a single source at roughly 2x its rendered
 * size, then encoded as AVIF, WebP and a JPEG fallback. `<picture>` offers
 * them in that order and the browser takes the first it can decode, so a
 * modern client downloads the AVIF and nothing else.
 *
 * The `*Card` entries are deliberately separate, smaller files: the home page
 * renders those three images in 325px cards, and should not have to pull the
 * 1600px detail screenshot to do it.
 *
 * Regenerate with the recipe in IMAGE_OPTIMIZATION.md.
 */

import landingPageJpg from "../assets/landingpage.jpg";
import landingPageWebp from "../assets/landingpage.webp";
import landingPageAvif from "../assets/landingpage.avif";
import landingPageCardJpg from "../assets/landingpage-card.jpg";
import landingPageCardWebp from "../assets/landingpage-card.webp";
import landingPageCardAvif from "../assets/landingpage-card.avif";
import keyvaultHomepageJpg from "../assets/keyvault-homepage.jpg";
import keyvaultHomepageWebp from "../assets/keyvault-homepage.webp";
import keyvaultHomepageAvif from "../assets/keyvault-homepage.avif";
import keyvaultHomepageCardJpg from "../assets/keyvault-homepage-card.jpg";
import keyvaultHomepageCardWebp from "../assets/keyvault-homepage-card.webp";
import keyvaultHomepageCardAvif from "../assets/keyvault-homepage-card.avif";
import twoDuLoginJpg from "../assets/2du-login.jpg";
import twoDuLoginWebp from "../assets/2du-login.webp";
import twoDuLoginAvif from "../assets/2du-login.avif";
import twoDuLoginCardJpg from "../assets/2du-login-card.jpg";
import twoDuLoginCardWebp from "../assets/2du-login-card.webp";
import twoDuLoginCardAvif from "../assets/2du-login-card.avif";
import twoDuTasksJpg from "../assets/2du-tasks.jpg";
import twoDuTasksWebp from "../assets/2du-tasks.webp";
import twoDuTasksAvif from "../assets/2du-tasks.avif";
import twoDuSettingsJpg from "../assets/2du-settings.jpg";
import twoDuSettingsWebp from "../assets/2du-settings.webp";
import twoDuSettingsAvif from "../assets/2du-settings.avif";
import limpHomepageJpg from "../assets/limp-homepage.jpg";
import limpHomepageWebp from "../assets/limp-homepage.webp";
import limpHomepageAvif from "../assets/limp-homepage.avif";
import limpHomepageCardJpg from "../assets/limp-homepage-card.jpg";
import limpHomepageCardWebp from "../assets/limp-homepage-card.webp";
import limpHomepageCardAvif from "../assets/limp-homepage-card.avif";
import limpDeliveriesJpg from "../assets/limp-deliveries.jpg";
import limpDeliveriesWebp from "../assets/limp-deliveries.webp";
import limpDeliveriesAvif from "../assets/limp-deliveries.avif";
import limpMenuJpg from "../assets/limp-menu.jpg";
import limpMenuWebp from "../assets/limp-menu.webp";
import limpMenuAvif from "../assets/limp-menu.avif";
import limpBottomPageJpg from "../assets/limp-btmpage.jpg";
import limpBottomPageWebp from "../assets/limp-btmpage.webp";
import limpBottomPageAvif from "../assets/limp-btmpage.avif";
import limpBeforeJpg from "../assets/before-limp.jpg";
import limpBeforeWebp from "../assets/before-limp.webp";
import limpBeforeAvif from "../assets/before-limp.avif";
import portraitJpg from "../assets/me.jpg";
import portraitWebp from "../assets/me.webp";
import portraitAvif from "../assets/me.avif";
import ugGalleryJpg from "../assets/ug23.jpg";
import ugGalleryWebp from "../assets/ug23.webp";
import ugGalleryAvif from "../assets/ug23.avif";
import ugExhibitionJpg from "../assets/ugexh.jpg";
import ugExhibitionWebp from "../assets/ugexh.webp";
import ugExhibitionAvif from "../assets/ugexh.avif";
import ugMstreetJpg from "../assets/ugMst.jpg";
import ugMstreetWebp from "../assets/ugMst.webp";
import ugMstreetAvif from "../assets/ugMst.avif";
import balmorisJpg from "../assets/balmoris.jpg";
import balmorisWebp from "../assets/balmoris.webp";
import balmorisAvif from "../assets/balmoris.avif";
import goodbyeSunshineJpg from "../assets/gbyesunshine.jpg";
import goodbyeSunshineWebp from "../assets/gbyesunshine.webp";
import goodbyeSunshineAvif from "../assets/gbyesunshine.avif";
import sublimitJpg from "../assets/sublimit.jpg";
import sublimitWebp from "../assets/sublimit.webp";
import sublimitAvif from "../assets/sublimit.avif";
import heavenJpg from "../assets/heaven.jpg";
import heavenWebp from "../assets/heaven.webp";
import heavenAvif from "../assets/heaven.avif";

export const landingPage: ImageAsset = {
  src: landingPageJpg,
  webpSrc: landingPageWebp,
  avifSrc: landingPageAvif,
};

export const landingPageCard: ImageAsset = {
  src: landingPageCardJpg,
  webpSrc: landingPageCardWebp,
  avifSrc: landingPageCardAvif,
};

export const keyvaultHomepage: ImageAsset = {
  src: keyvaultHomepageJpg,
  webpSrc: keyvaultHomepageWebp,
  avifSrc: keyvaultHomepageAvif,
};

export const keyvaultHomepageCard: ImageAsset = {
  src: keyvaultHomepageCardJpg,
  webpSrc: keyvaultHomepageCardWebp,
  avifSrc: keyvaultHomepageCardAvif,
};

export const twoDuLogin: ImageAsset = {
  src: twoDuLoginJpg,
  webpSrc: twoDuLoginWebp,
  avifSrc: twoDuLoginAvif,
};

export const twoDuLoginCard: ImageAsset = {
  src: twoDuLoginCardJpg,
  webpSrc: twoDuLoginCardWebp,
  avifSrc: twoDuLoginCardAvif,
};

export const twoDuTasks: ImageAsset = {
  src: twoDuTasksJpg,
  webpSrc: twoDuTasksWebp,
  avifSrc: twoDuTasksAvif,
};

export const twoDuSettings: ImageAsset = {
  src: twoDuSettingsJpg,
  webpSrc: twoDuSettingsWebp,
  avifSrc: twoDuSettingsAvif,
};

export const limpHomepage: ImageAsset = {
  src: limpHomepageJpg,
  webpSrc: limpHomepageWebp,
  avifSrc: limpHomepageAvif,
};

export const limpHomepageCard: ImageAsset = {
  src: limpHomepageCardJpg,
  webpSrc: limpHomepageCardWebp,
  avifSrc: limpHomepageCardAvif,
};

export const limpDeliveries: ImageAsset = {
  src: limpDeliveriesJpg,
  webpSrc: limpDeliveriesWebp,
  avifSrc: limpDeliveriesAvif,
};

export const limpMenu: ImageAsset = {
  src: limpMenuJpg,
  webpSrc: limpMenuWebp,
  avifSrc: limpMenuAvif,
};

export const limpBottomPage: ImageAsset = {
  src: limpBottomPageJpg,
  webpSrc: limpBottomPageWebp,
  avifSrc: limpBottomPageAvif,
};

export const limpBefore: ImageAsset = {
  src: limpBeforeJpg,
  webpSrc: limpBeforeWebp,
  avifSrc: limpBeforeAvif,
};

export const portrait: ImageAsset = {
  src: portraitJpg,
  webpSrc: portraitWebp,
  avifSrc: portraitAvif,
};

export const ugGallery: ImageAsset = {
  src: ugGalleryJpg,
  webpSrc: ugGalleryWebp,
  avifSrc: ugGalleryAvif,
};

export const ugExhibition: ImageAsset = {
  src: ugExhibitionJpg,
  webpSrc: ugExhibitionWebp,
  avifSrc: ugExhibitionAvif,
};

export const ugMstreet: ImageAsset = {
  src: ugMstreetJpg,
  webpSrc: ugMstreetWebp,
  avifSrc: ugMstreetAvif,
};

export const balmoris: ImageAsset = {
  src: balmorisJpg,
  webpSrc: balmorisWebp,
  avifSrc: balmorisAvif,
};

export const goodbyeSunshine: ImageAsset = {
  src: goodbyeSunshineJpg,
  webpSrc: goodbyeSunshineWebp,
  avifSrc: goodbyeSunshineAvif,
};

export const sublimit: ImageAsset = {
  src: sublimitJpg,
  webpSrc: sublimitWebp,
  avifSrc: sublimitAvif,
};

export const heaven: ImageAsset = {
  src: heavenJpg,
  webpSrc: heavenWebp,
  avifSrc: heavenAvif,
};
