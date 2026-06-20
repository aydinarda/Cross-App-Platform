import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { APP_STATUSES, APP_STATUS } from './lib/status';

// ---------------------------------------------------------------------------
// Normalized, table-based data model.
// Separate collections; related tables link back to an app via the `app`
// field (a reference() — a foreign key validated at build time).
//
//   apps         src/content/apps/<id>.md   one file per app (base fields + long description body)
//   downloads    src/data/downloads.json    one row per app+platform
//   guides       src/data/guides.json       one row per guide/resource
//   stats        src/data/stats.json        one row per exposed statistic
//
// Images are NOT a collection — logo + screenshots are auto-discovered from
// public/apps/<id>/ at build time (see src/lib/media.ts).
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

// "Downloads" table — each row is one platform target of one app.
const downloads = defineCollection({
  loader: file('src/data/downloads.json'),
  schema: z.object({
    app: reference('apps'), // FK -> apps.id
    platform: z.enum(['web', 'macos', 'windows', 'linux']),
    url: z.string().url(), // web → "Play" link; desktop → .app/.exe/.zip (GitHub Releases)
    version: z.string().optional(),
    size: z.string().optional(), // e.g. "175 MB"
    note: z.string().optional(), // e.g. "Apple Silicon"
  }),
});

// "Guides" table — admin/user/build guides and other resources.
const guides = defineCollection({
  loader: file('src/data/guides.json'),
  schema: z.object({
    app: reference('apps'), // FK -> apps.id
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
    label: z.string(), // e.g. "Players", "Downloads", "Version"
    value: z.union([z.string(), z.number()]).optional(), // shown directly (static) or as fallback (live)
    icon: z.string().optional(), // emoji, e.g. "🎮"
    source: z.enum(['static', 'live']).default('static'),
    url: z.string().url().optional(), // live: JSON endpoint to fetch
    field: z.string().optional(), // live: dot-path into the JSON, e.g. "data.activePlayers"
    suffix: z.string().optional(), // optional unit appended after the value, e.g. "MB"
  }),
});

export const collections = { apps, downloads, guides, stats };
