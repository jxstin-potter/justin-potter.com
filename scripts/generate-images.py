#!/usr/bin/env python3
"""
Regenerate the AVIF / WebP / JPEG variants in src/assets.

Every picture on the site is served through <picture>: the browser is offered
AVIF, then WebP, and falls back to a JPEG. This script produces all three from
a single source file, resized to roughly twice the size it is actually
rendered at, so a retina display is covered and nothing larger is shipped.

Sources live in src/assets/_originals/. Run from the repository root:

    python3 scripts/generate-images.py

Requires Pillow >= 11 (AVIF support is built in):

    pip install 'pillow>=11'

Anything written here is committed - the build does not run this script.
"""

import os
import sys
from PIL import Image

ASSETS = "src/assets"
ORIGINALS = os.path.join(ASSETS, "_originals")

# Max output width in pixels: about 2x the largest size each image is rendered
# at. Sources smaller than their target are never upscaled.
#
#   detail screenshots  rendered up to ~1400px wide in the hero stack
#   archive posters     rendered up to 600px wide, 2 across
#   before-limp         rendered in a ~600px case-study card
#   me (portrait)       rendered at clamp(240px, 24vw, 340px)
FULL_WIDTHS = {
    "landingpage": 1600,
    "2du-login": 1600,
    "2du-tasks": 1600,
    "2du-settings": 1600,
    "limp-homepage": 1600,
    "limp-deliveries": 1600,
    "limp-menu": 1600,
    "limp-btmpage": 1600,
    "before-limp": 1200,
    "me": 700,
    "ug23": 1200,
    "ugexh": 1200,
    "ugMst": 1200,
    "balmoris": 1200,
    "gbyesunshine": 1200,
    "sublimit": 1200,
    "heaven": 1200,
}

# These three are also shown in 325px cards on the home page. That is the
# critical path, so they get a second, much smaller asset rather than making
# the landing page download a 1600px detail screenshot.
CARD_IMAGES = {"landingpage", "2du-login", "limp-homepage"}
CARD_WIDTH = 700

# Icons keep their alpha channel and their .png extension, so no import
# changes are needed. They render at 12-60px.
ICONS = {"email": 128, "linkedin": 128, "github": 128}

JPEG_QUALITY = 84
WEBP_QUALITY = 82
AVIF_QUALITY = 50


def resize(image, width):
    if image.width <= width:
        return image
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.LANCZOS)


def emit(image, base, suffix=""):
    """Write the AVIF/WebP/JPEG trio for one asset."""
    stem = os.path.join(ASSETS, base + suffix)
    rgb = image.convert("RGB")  # every source here is fully opaque
    rgb.save(stem + ".jpg", "JPEG", quality=JPEG_QUALITY,
             progressive=True, optimize=True, subsampling=1)
    rgb.save(stem + ".webp", "WEBP", quality=WEBP_QUALITY, method=6)
    rgb.save(stem + ".avif", "AVIF", quality=AVIF_QUALITY)


def find_source(base):
    for entry in sorted(os.listdir(ORIGINALS)):
        if os.path.splitext(entry)[0] == base:
            return os.path.join(ORIGINALS, entry)
    return None


def main():
    if not os.path.isdir(ORIGINALS):
        sys.exit(f"missing {ORIGINALS}/ - run this from the repository root")

    written = 0
    for base, width in FULL_WIDTHS.items():
        source = find_source(base)
        if source is None:
            print(f"  skip {base}: no source in {ORIGINALS}/")
            continue
        image = Image.open(source)
        emit(resize(image, width), base)
        written += 3
        if base in CARD_IMAGES:
            emit(resize(image, CARD_WIDTH), base, "-card")
            written += 3
        print(f"  {base}")

    for icon, width in ICONS.items():
        source = find_source(icon)
        if source is None:
            continue
        image = Image.open(source).convert("RGBA")  # keep transparency
        if image.width > width:
            height = round(image.height * width / image.width)
            image = image.resize((width, height), Image.LANCZOS)
        image.save(os.path.join(ASSETS, icon + ".png"), "PNG", optimize=True)
        written += 1
        print(f"  {icon} (icon)")

    print(f"\nwrote {written} files to {ASSETS}/")
    print("Add any new asset to src/data/images.ts so it reaches a component.")


if __name__ == "__main__":
    main()
