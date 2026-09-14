import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { APP_STATUSES, APP_STATUS } from './lib/status';

// ---------------------------------------------------------------------------
// Normalized, table-based data model.
// Separate collections; related tables link back to an app via the `app`
// field (a reference() — a foreign key validated at build time).
//
//   apps         src/content/apps/<id>.md               one file per app (base fields + long description body)
//   versions     src/content/versions/<id>/<slug>.md    optional parallel editions of an app (id "<id>/<slug>")
//   downloads    src/data/downloads.json                one row per app+platform (optionally per version)
//   guides       src/data/guides.json                   one row per guide/resource (optionally per version)
//   stats        src/data/stats.json                    one row per exposed statistic (optionally per version)
//
// A row without `version` is shared by every version of its app; a row with `version` only shows on
// that version's page. Apps without version files are unaffected.
//
// Images are NOT a collection — logo + screenshots are auto-discovered from
// public/apps/<id>/ (and public/apps/<id>/<slug>/ for versions) at build time (see src/lib/media.ts).
// ---------------------------------------------------------------------------

// "Apps" table — base fields in frontmatter, long description in the markdown body.
const apps = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/apps' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string().optional(),
    description: z.string().optional(), // short text shown on the card
    category: z.string().optional(),
    status: z.enum(APP_STATUSES).default(APP_STATUS.LIVE), // values defined in src/lib/status.ts ("down" = offline, "preparation" = not built yet)
    draft: z.boolean().default(false), // true = hidden everywhere (no card, no detail page)
    featured: z.boolean().default(false),
    order: z.number().default(999), // home page ordering (smaller = first)
    accent: z.string().optional(), // card accent color, e.g. "#3b82f6"
    repo: z.string().url().optional(),
  }),
});

// "Versions" table — parallel editions of one app (e.g. a desktop and a web edition).
// The entry id is "<app>/<slug>" from the file path; the page is /apps/<app>/<slug>.
// Don't add a `slug` frontmatter field — it would override the id.
const versions = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/versions' }),
  schema: z.object({
    app: reference('apps'), // FK -> apps.id (must match the folder name)
    label: z.string(), // tab label, e.g. "UZH Edition"
    tagline: z.string().optional(), // falls back to the app's
    description: z.string().optional(), // falls back to the app's
    status: z.enum(APP_STATUSES).default(APP_STATUS.LIVE),
    default: z.boolean().default(false), // the version shown at /apps/<app> and on the card
    order: z.number().default(999), // tab order (smaller = first)
    repo: z.string().url().optional(), // falls back to the app's
    draft: z.boolean().default(false), // true = no tab, no page, its rows are hidden
  }),
});

// "Downloads" table — each row is one platform target of one app.
const downloads = defineCollection({
  loader: file('src/data/downloads.json'),
  schema: z.object({
    app: reference('apps'), // FK -> apps.id
    version: reference('versions').optional(), // FK -> versions.id ("<app>/<slug>"); omit = shared
    platform: z.enum(['web', 'macos', 'windows', 'linux']),
    url: z.string().url(), // web → "Play" link; desktop → .app/.exe/.zip (GitHub Releases)
    release: z.string().optional(), // build number shown as "v1.2.0"
    size: z.string().optional(), // e.g. "175 MB"
    note: z.string().optional(), // e.g. "Apple Silicon"
  }),
});

// "Guides" table — admin/user/build guides and other resources.
const guides = defineCollection({
  loader: file('src/data/guides.json'),
  schema: z.object({
    app: reference('apps'), // FK -> apps.id
    version: reference('versions').optional(), // FK -> versions.id; omit = shared
    type: z.enum(['admin', 'user', 'build', 'other']).default('other'),
    label: z.string(),
    url: z.string(), // /apps/<id>/guides/...  or an external URL
  }),
});

// "Stats" table — exposed per-app statistics.
//   source: "static" → `value` shown as-is (manually maintained).
//   source: "live"   → browser fetches `url` and reads `field` (dot-path) to update the value.
//                      The app must expose a PUBLIC, CORS-enabled JSON endpoint.
const stats = defineCollection({
  loader: file('src/data/stats.json'),
  schema: z.object({
    app: reference('apps'), // FK -> apps.id
    version: reference('versions').optional(), // FK -> versions.id; omit = shared
    label: z.string(), // e.g. "Players", "Downloads", "Version"
    value: z.union([z.string(), z.number()]).optional(), // shown directly (static) or as fallback (live)
    icon: z.string().optional(), // emoji, e.g. "🎮"
    source: z.enum(['static', 'live']).default('static'),
    url: z.string().url().optional(), // live: JSON endpoint to fetch
    field: z.string().optional(), // live: dot-path into the JSON, e.g. "data.activePlayers"
    suffix: z.string().optional(), // optional unit appended after the value, e.g. "MB"
  }),
});

export const collections = { apps, versions, downloads, guides, stats };
