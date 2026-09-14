import { getCollection, type CollectionEntry } from 'astro:content';

// Optional parallel editions of an app: src/content/versions/<appId>/<slug>.md
// → entry id "<appId>/<slug>", page /apps/<appId>/<slug>. Apps without version files are unaffected.
export type Version = CollectionEntry<'versions'>;

// Non-draft versions grouped by app id, each list sorted by `order`.
export async function getVersionsByApp(): Promise<Map<string, Version[]>> {
  const byApp = new Map<string, Version[]>();
  for (const version of await getCollection('versions')) {
    if (version.data.draft) continue;
    const key = version.data.app.id;
    byApp.set(key, [...(byApp.get(key) ?? []), version]);
  }
  for (const list of byApp.values()) list.sort((a, b) => a.data.order - b.data.order);
  return byApp;
}

// The version shown at /apps/<appId>: the one marked `default`, else the first by order.
export function getDefaultVersion(versions: Version[]): Version | undefined {
  return versions.find((v) => v.data.default) ?? versions[0];
}

// "tne-case/uzh" -> "uzh"
export function versionSlug(version: Version): string {
  return version.id.slice(version.id.indexOf('/') + 1);
}

// Rows of one app that apply to a version: shared rows (no `version`) plus that version's own rows.
export function rowsFor<T extends { app: { id: string }; version?: { id: string } }>(
  rows: T[],
  appId: string,
  versionId?: string
): T[] {
  return rows.filter((r) => r.app.id === appId && (!r.version || r.version.id === versionId));
}
