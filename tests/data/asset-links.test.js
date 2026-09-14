import assert from 'node:assert/strict';
import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  assertFileExists,
  dataFiles,
  imageExtensions,
  isLocalUrl,
  localUrlToPublicPath,
  publicAppsDir,
  readApps,
  readJsonArray,
  readVersions,
  relative,
  reservedVersionSlugs,
} from '../utils/project.js';

function listDirs(dirPath) {
  if (!existsSync(dirPath)) return [];
  return readdirSync(dirPath).filter((name) => statSync(path.join(dirPath, name)).isDirectory());
}

test('local guide URLs point to files committed under public', () => {
  const rows = readJsonArray(dataFiles.guides);

  rows.forEach((row, index) => {
    if (!isLocalUrl(row.url)) return;

    assertFileExists(localUrlToPublicPath(row.url), `guides[${index}].url`);
  });
});

test('public app asset folders map to known app manifests', () => {
  if (!existsSync(publicAppsDir)) return;

  const appIds = new Set(readApps().map((app) => app.id));

  for (const appId of listDirs(publicAppsDir)) {
    assert.ok(appIds.has(appId), `public/apps/${appId} has no matching app manifest`);
  }
});

test('public app subfolders are guides, screenshots, or a version of that app', () => {
  if (!existsSync(publicAppsDir)) return;

  const versions = readVersions();

  for (const appId of listDirs(publicAppsDir)) {
    const versionSlugs = new Set(versions.filter((v) => v.appDir === appId).map((v) => v.slug));

    for (const name of listDirs(path.join(publicAppsDir, appId))) {
      assert.ok(
        reservedVersionSlugs.has(name) || versionSlugs.has(name),
        `public/apps/${appId}/${name} is neither guides/, screenshots/ nor a version of ${appId}`
      );
    }
  }
});

test('app screenshots use supported image extensions and are non-empty', () => {
  if (!existsSync(publicAppsDir)) return;

  for (const appId of listDirs(publicAppsDir)) {
    const appDir = path.join(publicAppsDir, appId);
    const screenshotsDirs = [
      path.join(appDir, 'screenshots'),
      ...listDirs(appDir)
        .filter((name) => !reservedVersionSlugs.has(name))
        .map((slug) => path.join(appDir, slug, 'screenshots')),
    ];

    for (const screenshotsDir of screenshotsDirs) {
      if (!existsSync(screenshotsDir)) continue;

      for (const name of readdirSync(screenshotsDir)) {
        const filePath = path.join(screenshotsDir, name);
        if (!statSync(filePath).isFile()) continue;
        if (name.startsWith('.')) continue;

        assert.ok(
          imageExtensions.has(path.extname(name).toLowerCase()),
          `${relative(filePath)} must use a supported image extension`
        );
        assert.ok(statSync(filePath).size > 0, `${relative(filePath)} must not be empty`);
      }
    }
  }
});
