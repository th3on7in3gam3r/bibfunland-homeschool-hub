const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const rootDir = process.cwd();
const iconsDir = path.join(rootDir, 'public', 'icons');
const splashDir = path.join(rootDir, 'public', 'splash');

const iconSizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

const splashScreens = [
  { file: 'apple-splash-1179x2556.png', width: 1179, height: 2556 },
  { file: 'apple-splash-1290x2796.png', width: 1290, height: 2796 },
  { file: 'apple-splash-1170x2532.png', width: 1170, height: 2532 },
  { file: 'apple-splash-1284x2778.png', width: 1284, height: 2778 },
  { file: 'apple-splash-1125x2436.png', width: 1125, height: 2436 },
  { file: 'apple-splash-1242x2688.png', width: 1242, height: 2688 },
  { file: 'apple-splash-750x1334.png', width: 750, height: 1334 },
  { file: 'apple-splash-828x1792.png', width: 828, height: 1792 },
  { file: 'apple-splash-1242x2208.png', width: 1242, height: 2208 },
  { file: 'apple-splash-1536x2048.png', width: 1536, height: 2048 },
  { file: 'apple-splash-1668x2224.png', width: 1668, height: 2224 },
  { file: 'apple-splash-1668x2388.png', width: 1668, height: 2388 },
  { file: 'apple-splash-2048x2732.png', width: 2048, height: 2732 },
];

async function ensureDirs() {
  await fs.mkdir(iconsDir, { recursive: true });
  await fs.mkdir(splashDir, { recursive: true });
}

async function renderIcons() {
  for (const size of iconSizes) {
    const preferredSrc = path.join(iconsDir, `icon-${size}x${size}.svg`);
    const fallbackSrc = path.join(iconsDir, 'icon-512x512.svg');
    const src = await fs
      .access(preferredSrc)
      .then(() => preferredSrc)
      .catch(() => fallbackSrc);
    const dest = path.join(iconsDir, `icon-${size}x${size}.png`);
    await sharp(src).resize(size, size).png({ compressionLevel: 9 }).toFile(dest);
  }

  await sharp(path.join(iconsDir, 'icon-maskable-192x192.svg'))
    .png({ compressionLevel: 9 })
    .toFile(path.join(iconsDir, 'icon-maskable-192x192.png'));

  await sharp(path.join(iconsDir, 'icon-maskable-512x512.svg'))
    .png({ compressionLevel: 9 })
    .toFile(path.join(iconsDir, 'icon-maskable-512x512.png'));
}

async function renderSplashScreens() {
  const logoBuffer = await sharp(path.join(iconsDir, 'icon-512x512.svg'))
    .resize(420, 420, { fit: 'contain' })
    .png()
    .toBuffer();

  for (const screen of splashScreens) {
    await sharp({
      create: {
        width: screen.width,
        height: screen.height,
        channels: 4,
        background: '#1E3A8A',
      },
    })
      .composite([
        {
          input: logoBuffer,
          gravity: 'center',
        },
      ])
      .png({ compressionLevel: 9 })
      .toFile(path.join(splashDir, screen.file));
  }
}

async function main() {
  await ensureDirs();
  await renderIcons();
  await renderSplashScreens();
  console.log('PWA PNG icons and iOS splash screens generated.');
}

main().catch((err) => {
  console.error('Failed to generate PWA assets:', err);
  process.exit(1);
});