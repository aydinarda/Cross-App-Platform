import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  assertFileExists,
  distDir,
  readApps,
  readBasePath,
  relative,
  walkFiles,
} from '../utils/project.js';

const distExists = existsSync(distDir);

test('build output contains the home page', { skip: !distExists && 'Run pnpm build first' }, () => {
  assertFileExists(path.join(distDir, 'index.html'), 'home page build output');
});

test('build output contains only non-draft app routes', {
  skip: !distExists && 'Run pnpm build first',
}, () => {
  const apps = readApps();

  for (const app of apps) {
    const routePath = path.join(distDir, 'apps', app.id, 'index.html');

    if (app.draft) {
      assert.ok(!existsSync(routePath), `${app.id} is draft and must not produce a route`);
    } else {
      assertFileExists(routePath, `${app.id} route build output`);
    }
  }
});

test('built HTML does not leave internal app links without the configured base path', {
  skip: !distExists && 'Run pnpm build first',
}, () => {
  const htmlFiles = walkFiles(distDir, (filePath) => filePath.endsWith('.html'));
  const unbasedInternalAppLink = /\b(?:href|src)="\/apps\//;

  for (const filePath of htmlFiles) {
    const html = readFileSync(filePath, 'utf8');

    assert.ok(
      !unbasedInternalAppLink.test(html),
      `${relative(filePath)} contains an internal /apps link without the configured base path`
    );
  }
});

test('built internal href and src references resolve inside dist', {
  skip: !distExists && 'Run pnpm build first',
}, () => {
  const base = readBasePath();
  const htmlFiles = walkFiles(distDir, (filePath) => filePath.endsWith('.html'));

  for (const filePath of htmlFiles) {
    const html = readFileSync(filePath, 'utf8');
    const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);

    for (const ref of refs) {
      const builtPath = resolveBuiltInternalPath(ref, base);
      if (!builtPath) continue;

      assert.ok(
        existsSync(builtPath),
        `${relative(filePath)} references missing build output: ${ref}`
      );
    }
  }
});

function resolveBuiltInternalPath(ref, base) {
  if (ref.startsWith('http://') || ref.startsWith('https://') || ref.startsWith('//')) return undefined;
  if (ref.startsWith('mailto:') || ref.startsWith('#')) return undefined;

  const pathname = new URL(ref, 'https://example.test').pathname;
  const normalizedBase = base || '';
  let relativeUrl = pathname;

  if (normalizedBase && pathname === normalizedBase) {
    relativeUrl = '/';
  } else if (normalizedBase && pathname.startsWith(`${normalizedBase}/`)) {
    relativeUrl = pathname.slice(normalizedBase.length);
  } else if (pathname.startsWith('/_astro/')) {
    relativeUrl = pathname;
  } else {
    return undefined;
  }

  const clean = decodeURIComponent(relativeUrl.replace(/^\//, ''));
  const directPath = path.join(distDir, clean);
  if (path.extname(clean)) return directPath;

  return path.join(directPath, 'index.html');
}
