# Image Optimization Guide

This project uses optimized image components that support WebP and AVIF formats with automatic fallbacks.

## Components

- **OptimizedImage**: For large images (project screenshots, etc.)
- **OptimizedIcon**: For small icons (social media, email, etc.)

## Converting Images to WebP/AVIF

### Using Online Tools
1. **Squoosh** (https://squoosh.app/) - Best quality, browser-based
2. **CloudConvert** (https://cloudconvert.com/) - Batch conversion
3. **ImageOptim** (Mac) - Desktop app with WebP support

### Using Command Line Tools

#### WebP (using cwebp)
```bash
# Install webp tools
# macOS: brew install webp
# Ubuntu: sudo apt-get install webp

# Convert single image
cwebp -q 80 input.png -o output.webp

# Convert all PNGs in assets folder
for file in src/assets/*.png; do
  cwebp -q 80 "$file" -o "${file%.png}.webp"
done
```

#### AVIF (using avifenc)
```bash
# Install libavif tools
# macOS: brew install libavif
# Ubuntu: sudo apt-get install libavif-bin

# Convert single image
avifenc -c aom -q 60 input.png output.avif

# Convert all PNGs in assets folder
for file in src/assets/*.png; do
  avifenc -c aom -q 60 "$file" "${file%.png}.avif"
done
```

### Using Node.js Script

Create a script to automate conversion:

```javascript
// scripts/convert-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../src/assets');
const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png'));

files.forEach(async (file) => {
  const inputPath = path.join(assetsDir, file);
  const baseName = path.basename(file, '.png');
  
  // Convert to WebP
  await sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(path.join(assetsDir, `${baseName}.webp`));
  
  // Convert to AVIF
  await sharp(inputPath)
    .avif({ quality: 60 })
    .toFile(path.join(assetsDir, `${baseName}.avif`));
});
```

## Usage

### Basic Usage (PNG only - will work, but not optimized)
```tsx
import OptimizedImage from './components/OptimizedImage';
import projectImage from './assets/landingpage.png';

<OptimizedImage
  src={projectImage}
  alt="Project screenshot"
/>
```

### With WebP/AVIF (Optimized)
```tsx
import OptimizedImage from './components/OptimizedImage';
import projectImage from './assets/landingpage.png';
import projectImageWebp from './assets/landingpage.webp';
import projectImageAvif from './assets/landingpage.avif';

<OptimizedImage
  src={projectImage}
  webpSrc={projectImageWebp}
  avifSrc={projectImageAvif}
  alt="Project screenshot"
  priority={false} // Use lazy loading
/>
```

### With Framer Motion Hover Effects
```tsx
<OptimizedImage
  src={projectImage}
  webpSrc={projectImageWebp}
  alt="Project screenshot"
  whileHover={{
    filter: 'brightness(1.1)',
    transition: { duration: 0.3 }
  }}
/>
```

### Icons
```tsx
import OptimizedIcon from './components/OptimizedIcon';
import emailIcon from './assets/email.png';
import emailIconWebp from './assets/email.webp';

<OptimizedIcon
  src={emailIcon}
  webpSrc={emailIconWebp}
  alt="Email icon"
  size={24}
/>
```

## Current Image Status

### Project Images
- `landingpage.png` - Used in MainContent and Archive
  - ✅ Infrastructure ready
  - ⏳ Needs WebP/AVIF conversion

### Social Icons
- `email.png` - Used in Contact
- `linkedin.png` - Used in About and Contact
- `github.png` - Used in About and Contact
  - ✅ Infrastructure ready
  - ⏳ Needs WebP/AVIF conversion

### Unused Assets
- `education.png`
- `experience.png`

## Performance Benefits

- **WebP**: ~30% smaller than PNG with same quality
- **AVIF**: ~50% smaller than PNG with same quality
- **Lazy Loading**: Images load only when near viewport
- **Automatic Fallbacks**: Browser automatically chooses best supported format

## Browser Support

- **AVIF**: Chrome 85+, Firefox 93+, Safari 16+
- **WebP**: Chrome 23+, Firefox 65+, Safari 14+, Edge 18+
- **PNG**: Universal fallback
