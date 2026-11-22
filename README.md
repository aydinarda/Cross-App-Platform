# App Hub — Cross-App Marketing Platform

A **data-driven** static site that gathers indie games/apps into a single showcase.
Each app is described by a single manifest file; the site **automatically** generates the home page
cards and the detail pages from these manifests.

**Stack:** [Astro](https://astro.build) (content collections) · GitHub Pages · GitHub Releases (binary distribution)

---

## Development

Uses [**pnpm**](https://pnpm.io). Packages live in a single global store
(`~/Library/pnpm/store`) and each project's `node_modules` is hard-linked from it — so no
duplicated downloads across projects. Install pnpm once with `npm i -g pnpm`.

```bash
pnpm install
pnpm dev      # http://localhost:4321/Cross-App-Platform/
pnpm build    # static output → dist/  (manifests validated with zod)
pnpm preview  # serve the build output locally
pnpm verify   # astro check + data tests + build + build-output tests
```

> `pnpm-workspace.yaml` whitelists the native build scripts (`esbuild`, `sharp`) that Astro/Vite
> need — pnpm blocks install scripts by default.

---

## Data model

The data is **normalized** into five separate collections, linked by an `app` reference (foreign key):

| Collection | File | One row = |
|---|---|---|
| `apps` | `src/content/apps/<id>.md` | an app (base fields + long-description body) |
| `versions` | `src/content/versions/<id>/<slug>.md` | an optional parallel edition of an app (base fields + version-specific body) |
| `downloads` | `src/data/downloads.json` | one app+platform download/play link |
| `guides` | `src/data/guides.json` | one guide / resource |
| `stats` | `src/data/stats.json` | one exposed statistic (static, or live via a CORS endpoint) |

**Images are not a collection.** The logo and screenshots are **auto-discovered** from
`public/apps/<id>/` at build time (`src/lib/media.ts`) — just drop files in, no JSON to maintain:
- `public/apps/<id>/logo.png` → card + detail logo
- `public/apps/<id>/screenshots/*` → detail-page gallery (sorted by filename; prefix `01-`, `02-` to control order)

### Versions (parallel editions)

Some apps ship in several editions at the same time (e.g. TNE Case: a web **UZH Edition** and a
**Desktop** edition). Versions are optional — apps without version files work exactly as before.

- A version's id is `<app-id>/<slug>` (from its file path); its page is `/apps/<app-id>/<slug>`.
  `/apps/<app-id>` shows the version marked `default: true` and the page has one tab per version.
- `tagline`, `description`, `status` and `repo` on a version override the app's. The app body is a
  shared overview; the version body is shown below it.
- Rows in `downloads` / `guides` / `stats` with `"version": "<app-id>/<slug>"` only show on that version.
  Rows without `version` are shared by all versions of the app.
- Images: `public/apps/<app-id>/<slug>/logo.png` and `.../<slug>/screenshots/*` override the app's.
- `draft: true` on a version hides its tab, its page and its rows.
- A release number of a build goes in the download row's `release` field (shown as `v1.2.0`).

`CONTENT.md` is the human-friendly editing surface — the same tables in Markdown. Edit there,
then the values are transferred into the files above.

## How to add a new app

1. Copy `templates/app.template.md` to `src/content/apps/<id>.md`
   (`<id>` = url-friendly short name, e.g. `my-game` → detail page `/apps/my-game`). Fill in the base fields.
2. Add the app's rows to the data tables (set `"app": "<id>"` on each row):
   - `src/data/downloads.json` — one row per platform (`web`/`macos`/`windows`/`linux`)
   - `src/data/guides.json` — one row per guide
   - `src/data/stats.json` — optional exposed stats (`static`, or `live` with a CORS endpoint)
3. Drop images into `public/apps/<id>/` — `logo.png` and `screenshots/*` are picked up automatically.
   Put downloadable guides under `public/apps/<id>/guides/`.
4. **Do not commit** large `.app`/`.exe`/`.zip` files — upload them to the corresponding game's GitHub
   Releases page and only set the `url` in `downloads.json`.
5. Check with `pnpm dev` — the card and detail page appear automatically.

If a field is missing/invalid, `pnpm verify` fails: `pnpm build` checks the zod schemas
(`src/content.config.ts`), and `tests/data` checks that every `app` / `version` reference exists and that
folders follow the conventions. `astro build` alone does **not** catch an unknown reference.

### Adding versions to an app

1. Copy `templates/version.template.md` to `src/content/versions/<id>/<slug>.md` for each edition
   (`<slug>` must be url-friendly and not `guides` / `screenshots`). Set `app: <id>` and a `label`.
2. Mark exactly one version `default: true`.
3. On rows that belong to one edition only, add `"version": "<id>/<slug>"`.
4. Optionally add `public/apps/<id>/<slug>/logo.png` and `screenshots/`.

---

## Structure

```
src/
  content.config.ts      # 5 collections + zod schemas (apps, versions, downloads, guides, stats)
  content/apps/*.md      # "apps" table: base fields (frontmatter) + long description (body)
  content/versions/<id>/<slug>.md   # "versions" table: parallel editions of an app
  data/
    downloads.json       # "downloads" table (rows reference app, optionally version)
    guides.json          # "guides" table
    stats.json           # "stats" table (static or live-via-CORS)
  layouts/Base.astro     # theme + global styles + password gate
  components/            # AppCard, AppDetail, VersionTabs, DownloadButtons, GuideList, ScreenshotGallery, Stats
  pages/
    index.astro          # card grid (joins downloads → chips, auto logo, version count)
    apps/[id].astro      # detail page (default version for versioned apps)
    apps/[id]/[version].astro  # one page per version
  lib/url.ts             # GitHub Pages base-path helper
  lib/media.ts           # auto-discovers logo + screenshots from public/apps/<id>/[<slug>/]
  lib/versions.ts        # version lookup, default version, per-version row filtering
public/apps/<id>/        # logo, screenshots, guides, <slug>/ version media (served statically)
tests/                   # data integrity (tests/data) + build output (tests/routes)
CONTENT.md               # editing surface: the tables in Markdown
templates/app.template.md
templates/version.template.md
.github/workflows/deploy.yml
```

---

## Deploying (GitHub Pages)

1. Update the `site` and `base` values in `astro.config.mjs` with your own username / repo name
   (choose a **space-free** repo name, e.g. `cross-app-platform`).
2. Push the repo to GitHub.
3. GitHub → **Settings → Pages → Source: GitHub Actions**.
4. Every push to `main` automatically builds + deploys (`.github/workflows/deploy.yml`).

---

## Open ends (content)

- **Newsvendor:** add the live web URL as a `web` row in `downloads.json` after the Render deploy.
- **TNE Case — Desktop:** publish the `.zip` builds to GitHub Releases (the build workflow only uploads
  workflow artifacts), point the `tne-case-desktop-*` rows at the direct asset URLs, and set the
  version's `status` to `live`.
- Add real in-game screenshots to `public/apps/<id>/screenshots/` (or `<id>/<slug>/screenshots/`).
