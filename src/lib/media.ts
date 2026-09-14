import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

// Convention-based media: drop files into public/apps/<id>/ and they are picked up
// automatically at build time — no JSON to maintain.
//   logo:        public/apps/<id>/logo.(png|jpg|jpeg|webp|svg)   (or icon.*)
//   screenshots: every image in public/apps/<id>/screenshots/
// A version can override both in public/apps/<id>/<slug>/ — otherwise the app's files are used.
const PUBLIC = path.join(process.cwd(), 'public');
const IMG = /\.(png|jpe?g|webp|gif|avif|svg)$/i;
const LOGO_NAMES = ['logo.png', 'logo.svg', 'logo.webp', 'logo.jpg', 'logo.jpeg', 'icon.png'];

export function getLogo(appId: string, versionSlug?: string): string | undefined {
  const dirs = versionSlug ? [`${appId}/${versionSlug}`, appId] : [appId];
  for (const dir of dirs) {
    for (const name of LOGO_NAMES) {
      if (existsSync(path.join(PUBLIC, 'apps', dir, name))) return `/apps/${dir}/${name}`;
    }
  }
  return undefined;
}

export interface Shot {
  file: string;
  caption: string;
}

export function getScreenshots(appId: string, versionSlug?: string): Shot[] {
  if (versionSlug) {
    const own = listScreenshots(`${appId}/${versionSlug}`);
    if (own.length > 0) return own;
  }
  return listScreenshots(appId);
}

function listScreenshots(dir: string): Shot[] {
  const abs = path.join(PUBLIC, 'apps', dir, 'screenshots');
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => IMG.test(f)) // ignores .DS_Store and non-images
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })) // 1,2,10 order; prefix files to control
    .map((f) => ({ file: `/apps/${dir}/screenshots/${f}`, caption: prettify(f) }));
}

// "01-Home-Page.png" -> "Home Page"
function prettify(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '') // strip extension
    .replace(/^\d+[-_.]?/, '') // strip leading numeric prefix (01-, 02_, 3.)
    .replace(/[-_]+/g, ' ') // dashes/underscores -> space
    .trim();
}
