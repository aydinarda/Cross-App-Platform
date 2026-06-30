import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assertNonEmptyString,
  assertValidUrl,
  dataFiles,
  isExternalUrl,
  readApps,
  readJsonArray,
} from '../utils/project.js';

const allowedPlatforms = new Set(['web', 'macos', 'windows', 'linux']);
const allowedGuideTypes = new Set(['admin', 'user', 'build', 'other', undefined]);
const allowedStatSources = new Set(['static', 'live', undefined]);

test('content app manifests expose stable ids and titles', () => {
  const apps = readApps();
  const ids = apps.map((app) => app.id);

  assert.ok(apps.length > 0, 'at least one app manifest is required');
  assert.equal(new Set(ids).size, ids.length, 'app ids must be unique');

  for (const app of apps) {
    assert.match(app.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${app.id} must be URL-friendly`);
    assertNonEmptyString(app.title, `${app.id}.title`);
  }
});

test('data tables are arrays with unique row ids when ids are present', () => {
  for (const [tableName, filePath] of Object.entries(dataFiles)) {
    const rows = readJsonArray(filePath);
    const ids = rows.map((row) => row.id).filter(Boolean);

    assert.equal(
      new Set(ids).size,
      ids.length,
      `${tableName}.json must not contain duplicate row ids`
    );
  }
});

test('data table app references point to existing app manifests', () => {
  const appIds = new Set(readApps().map((app) => app.id));

  for (const [tableName, filePath] of Object.entries(dataFiles)) {
    const rows = readJsonArray(filePath);

    rows.forEach((row, index) => {
      assertNonEmptyString(row.app, `${tableName}[${index}].app`);
      assert.ok(appIds.has(row.app), `${tableName}[${index}].app references an unknown app`);
    });
  }
});

test('downloads rows contain supported platforms and absolute URLs', () => {
  const rows = readJsonArray(dataFiles.downloads);

  rows.forEach((row, index) => {
    assert.ok(
      allowedPlatforms.has(row.platform),
      `downloads[${index}].platform must be one of ${[...allowedPlatforms].join(', ')}`
    );
    assertNonEmptyString(row.url, `downloads[${index}].url`);
    assertValidUrl(row.url, `downloads[${index}].url`);
  });
});

test('guide rows contain labels, supported types, and valid local or external URLs', () => {
  const rows = readJsonArray(dataFiles.guides);

  rows.forEach((row, index) => {
    assert.ok(
      allowedGuideTypes.has(row.type),
      `guides[${index}].type must be admin, user, build, or other`
    );
    assertNonEmptyString(row.label, `guides[${index}].label`);
    assertNonEmptyString(row.url, `guides[${index}].url`);

    if (isExternalUrl(row.url)) {
      assertValidUrl(row.url, `guides[${index}].url`);
    } else {
      assert.ok(row.url.startsWith('/'), `guides[${index}].url must be root-relative or external`);
      assert.ok(
        row.url.startsWith(`/apps/${row.app}/`),
        `guides[${index}].url must live under /apps/${row.app}/`
      );
    }
  });
});

test('stats rows have valid source-specific fields', () => {
  const rows = readJsonArray(dataFiles.stats);

  rows.forEach((row, index) => {
    assertNonEmptyString(row.label, `stats[${index}].label`);
    assert.ok(
      allowedStatSources.has(row.source),
      `stats[${index}].source must be static or live when provided`
    );

    if (row.source === 'live') {
      assertNonEmptyString(row.url, `stats[${index}].url`);
      assertValidUrl(row.url, `stats[${index}].url`);
      assertNonEmptyString(row.field, `stats[${index}].field`);
    }
  });
});
