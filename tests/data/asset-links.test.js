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
  relative,
} from '../utils/project.js';

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
  const publicAppIds = readdirSync(publicAppsDir).filter((name) => {
    const filePath = path.join(publicAppsDir, name);
    return statSync(filePath).isDirectory();
  });

  for (const appId of publicAppIds) {
    assert.ok(appIds.has(appId), `public/apps/${appId} has no matching app manifest`);
  }
});

test('app screenshots use supported image extensions and are non-empty', () => {
  if (!existsSync(publicAppsDir)) return;

  const publicAppIds = readdirSync(publicAppsDir).filter((name) => {
    const filePath = path.join(publicAppsDir, name);
    return statSync(filePath).isDirectory();
  });

  for (const appId of publicAppIds) {
    const screenshotsDir = path.join(publicAppsDir, appId, 'screenshots');
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
});
