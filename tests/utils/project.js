import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const srcDir = path.join(repoRoot, 'src');
export const dataDir = path.join(srcDir, 'data');
export const appsContentDir = path.join(srcDir, 'content', 'apps');
export const publicDir = path.join(repoRoot, 'public');
export const publicAppsDir = path.join(publicDir, 'apps');
export const distDir = path.join(repoRoot, 'dist');

export const dataFiles = {
  downloads: path.join(dataDir, 'downloads.json'),
  guides: path.join(dataDir, 'guides.json'),
  stats: path.join(dataDir, 'stats.json'),
};

export const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.svg']);

export function readJsonArray(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const value = JSON.parse(raw);
  assert.ok(Array.isArray(value), `${relative(filePath)} must contain a JSON array`);
  return value;
}

export function readApps() {
  return readdirSync(appsContentDir)
    .filter((name) => name.endsWith('.md') && !name.startsWith('_'))
    .map((name) => {
      const id = name.replace(/\.md$/, '');
      const filePath = path.join(appsContentDir, name);
      const raw = readFileSync(filePath, 'utf8');
      const frontmatter = parseFrontmatter(raw);

      return {
        id,
        filePath,
        title: readFrontmatterString(frontmatter, 'title'),
        draft: readFrontmatterBoolean(frontmatter, 'draft') ?? false,
      };
    });
}

export function readBasePath() {
  const configPath = path.join(repoRoot, 'astro.config.mjs');
  const raw = readFileSync(configPath, 'utf8');
  const match = raw.match(/\bbase:\s*['"]([^'"]+)['"]/);
  const base = match?.[1] ?? '';

  if (!base || base === '/') return '';
  return base.startsWith('/') ? base.replace(/\/$/, '') : `/${base.replace(/\/$/, '')}`;
}

export function isExternalUrl(value) {
  return /^(https?:)?\/\//.test(value) || value.startsWith('mailto:') || value.startsWith('#');
}

export function isLocalUrl(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');
}

export function localUrlToPublicPath(url) {
  const pathname = new URL(url, 'https://example.test').pathname;
  return path.join(publicDir, pathname.replace(/^\//, ''));
}

export function assertNonEmptyString(value, label) {
  assert.equal(typeof value, 'string', `${label} must be a string`);
  assert.notEqual(value.trim(), '', `${label} must not be empty`);
}

export function assertValidUrl(value, label) {
  assert.doesNotThrow(() => new URL(value), `${label} must be a valid absolute URL`);
}

export function assertFileExists(filePath, label) {
  assert.ok(existsSync(filePath), `${label} does not exist: ${relative(filePath)}`);
  assert.ok(statSync(filePath).isFile(), `${label} must be a file: ${relative(filePath)}`);
  assert.ok(statSync(filePath).size > 0, `${label} must not be empty: ${relative(filePath)}`);
}

export function walkFiles(rootDir, predicate = () => true) {
  if (!existsSync(rootDir)) return [];

  const files = [];
  for (const name of readdirSync(rootDir)) {
    const filePath = path.join(rootDir, name);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      files.push(...walkFiles(filePath, predicate));
    } else if (predicate(filePath)) {
      files.push(filePath);
    }
  }

  return files;
}

export function relative(filePath) {
  return path.relative(repoRoot, filePath);
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  return match?.[1] ?? '';
}

function readFrontmatterString(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match) return undefined;

  return match[1].split(/\s+#/)[0].trim().replace(/^['"]|['"]$/g, '');
}

function readFrontmatterBoolean(frontmatter, key) {
  const value = readFrontmatterString(frontmatter, key);
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}
