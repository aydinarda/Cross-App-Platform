import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

// Convention-based media: drop files into public/apps/<id>/ and they are picked up
// automatically at build time — no JSON to maintain.
//   logo:        public/apps/<id>/logo.(png|jpg|jpeg|webp|svg)   (or icon.*)
//   screenshots: every image in public/apps/<id>/screenshots/
const PUBLIC = path.join(process.cwd(), 'public');
const IMG = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

export function getLogo(appId: string): string | undefined {
  for (const name of ['logo.png', 'logo.svg', 'logo.webp', 'logo.jpg', 'logo.jpeg', 'icon.png']) {
    if (existsSync(path.join(PUBLIC, 'apps', appId, name))) return `/apps/${appId}/${name}`;
  }
  return undefined;
}

export interface Shot {
  file: string;
  caption: string;
}

export function getScreenshots(appId: string): Shot[] {
  const dir = path.join(PUBLIC, 'apps', appId, 'screenshots');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => IMG.test(f)) // ignores .DS_Store and non-images
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })) // 1,2,10 order; prefix files to control
    .map((f) => ({ file: `/apps/${appId}/screenshots/${f}`, caption: prettify(f) }));
}

// "01-Home-Page.png" -> "Home Page"
function prettify(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '') // strip extension
    .replace(/^\d+[-_.]?/, '') // strip leading numeric prefix (01-, 02_, 3.)
    .replace(/[-_]+/g, ' ') // dashes/underscores -> space
    .trim();
}
