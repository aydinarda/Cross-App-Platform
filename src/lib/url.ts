// GitHub Pages base-path support: when the site is served from a sub-path
// (e.g. /cross-app-platform), this prefixes the base to root-relative internal
// links ("/..."). External links (http(s) / mailto) are left untouched.
export function withBase(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('mailto:') || path.startsWith('#')) {
    return path;
  }
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : '/' + path);
}
