const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const swPath = path.join(process.cwd(), 'public', 'sw.js');

async function main() {
  const source = await fs.readFile(swPath, 'utf8');
  const version = `build-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

  const updated = source.replace(
    /const CACHE_VERSION = '.*?';/,
    `const CACHE_VERSION = '${version}';`
  );

  if (updated === source) {
    throw new Error("Could not find CACHE_VERSION line in public/sw.js");
  }

  await fs.writeFile(swPath, updated, 'utf8');
  console.log(`Injected service worker cache version: ${version}`);
}

main().catch((err) => {
  console.error('Failed to inject service worker version:', err);
  process.exit(1);
});