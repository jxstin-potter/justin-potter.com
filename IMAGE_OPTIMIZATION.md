# Image Optimization

Every picture on the site is served through `<picture>`. The browser is offered
AVIF first, then WebP, and falls back to a JPEG it is guaranteed to understand.
A modern client downloads the AVIF and nothing else.

## Where things live

| Path | What it is |
|---|---|
| `src/assets/_originals/` | Master images. Never imported by the app; the only input to the generator. |
| `src/assets/*.{avif,webp,jpg}` | Generated variants. These are what ship. |
| `scripts/generate-images.py` | Regenerates every variant from the originals. |
| `src/data/images.ts` | Binds the three files of each image into one `ImageAsset`. |
| `src/components/common/OptimizedImage.tsx` | Renders the `<picture>`. |

Variants are committed. The build does not run the generator.

## Regenerating

```bash
pip install 'pillow>=11'      # AVIF support is built in from Pillow 11
python3 scripts/generate-images.py
```

To add a new image: drop the master in `src/assets/_originals/`, add an entry to
`FULL_WIDTHS` in the script, run it, then export the asset from
`src/data/images.ts` so a component can reach it.

## Sizing

Each variant is generated at roughly **2x the size it is actually rendered at**,
so retina displays are covered and nothing bigger is shipped. Sources are never
upscaled.

| Group | Rendered at | Generated |
|---|---|---|
| Detail screenshots | up to ~1400px in the hero stack | 1600px |
| Archive posters | up to 600px, two across | 1200px |
| Case study (`before-limp`) | ~600px card | 1200px |
| Portrait (`me`) | `clamp(240px, 24vw, 340px)` | 700px |
| Home page cards | 325px | **700px, separate asset** |
| Icons | 12-60px | 128px, PNG with alpha |

The home page cards are deliberately their own smaller files. Three of those
images are also used full-size on project detail pages, and the landing page —
the critical path — should not have to download a 1600px screenshot to fill a
325px card.

## Using an image

`ImageAsset` bundles the three URLs, so spreading it passes all of them and a
call site cannot mismatch a WebP url with an AVIF slot:

```tsx
import OptimizedImage from "../components/common/OptimizedImage";
import { landingPage } from "../data/images";

<OptimizedImage {...landingPage} alt="CommerceFlow home page" />;
```

`priority` controls loading. Leave it `false` (the default) for anything below
the fold — the component lazy-loads via `IntersectionObserver`. Set it `true`
for the first image on a detail page so it is not deferred:

```tsx
<OptimizedImage {...limpHomepage} alt="Homepage" priority={true} />
```

## Two things to be careful about

**Do not pass a bare `srcSet`.** It is a single format-less string. It applies
to the `<img>` fallback only and deliberately does not override the `<source>`
tags — putting one string on both would hand the AVIF source WebP urls, and a
browser that prefers AVIF would download WebP bytes under an AVIF content type
and fail to decode. Distinct sizes belong in distinct `ImageAsset`s, the way the
`*Card` variants are done.

**Inlining is switched off.** `.env` sets `IMAGE_INLINE_SIZE_LIMIT=0`. Create
React App otherwise inlines any asset under 10kB into the JS bundle as base64,
which is the wrong trade here: an inlined variant is downloaded by every
browser as part of the bundle, including ones that cannot decode that format
and will never display it. The small AVIF card images were adding ~10kB to the
main chunk this way.

## Results

Measured from `build/static/media` on a browser that takes the AVIF:

| Route | Before | After |
|---|---|---|
| `/` (home) | 1,540 KB | **20 KB** |
| `/about` | 973 KB | **32 KB** |
| `/projects/2du` | 301 KB | **24 KB** |
| `/projects/limprimerie-bakery` | 2,962 KB | **189 KB** |
| `/archive` | 2,572 KB | **491 KB** |
| All routes | 8,348 KB | **756 KB** |
