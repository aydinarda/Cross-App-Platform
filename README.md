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
pnpm dev      # http://localhost:4321/cross-app-platform/
pnpm build    # static output → dist/  (manifests validated with zod)
pnpm preview  # serve the build output locally
```

> `pnpm-workspace.yaml` whitelists the native build scripts (`esbuild`, `sharp`) that Astro/Vite
> need — pnpm blocks install scripts by default.

---

## Data model

The data is **normalized** into five separate collections, linked by an `app` reference (foreign key):

| Collection | File | One row = |
|---|---|---|
| `apps` | `src/content/apps/<id>.md` | an app (base fields + long-description body) |
| `downloads` | `src/data/downloads.json` | one app+platform download/play link |
| `guides` | `src/data/guides.json` | one guide / resource |
| `visuals` | `src/data/visuals.json` | one image (logo / icon / screenshot / background) |
| `stats` | `src/data/stats.json` | one exposed statistic (static, or live via a CORS endpoint) |

`CONTENT.md` is the human-friendly editing surface — the same five tables in Markdown. Edit there,
then the values are transferred into the files above.

## How to add a new app

1. Copy `templates/app.template.md` to `src/content/apps/<id>.md`
   (`<id>` = url-friendly short name, e.g. `my-game` → detail page `/apps/my-game`). Fill in the base fields.
2. Add the app's rows to the data tables (set `"app": "<id>"` on each row):
   - `src/data/downloads.json` — one row per platform (`web`/`macos`/`windows`/`linux`)
   - `src/data/guides.json` — one row per guide
   - `src/data/visuals.json` — a `logo` row (for the card) + any `screenshot` rows
   - `src/data/stats.json` — optional exposed stats (`static`, or `live` with a CORS endpoint)
3. Put assets under `public/apps/<id>/`: `logo.png`, `screenshots/*.png`, `guides/*.pdf`.
4. **Do not commit** large `.app`/`.exe`/`.zip` files — upload them to the corresponding game's GitHub
   Releases page and only set the `url` in `downloads.json`.
5. Check with `pnpm dev` — the card and detail page appear automatically.

If a field is missing/invalid (e.g. a row references an unknown `app`), `pnpm build` fails
(zod schema + references — see `src/content.config.ts`).

---

## Structure

```
src/
  content.config.ts      # 4 collections + zod schemas (apps, downloads, guides, screenshots)
  content/apps/*.md      # "apps" table: base fields (frontmatter) + long description (body)
  data/
    downloads.json       # "downloads" table (rows reference app)
    guides.json          # "guides" table
    visuals.json         # "visuals" table (logo / icon / screenshot / background)
    stats.json           # "stats" table (static or live-via-CORS)
  layouts/Base.astro     # theme + global styles
  components/             # AppCard, DownloadButtons, GuideList, ScreenshotGallery, Stats
  pages/
    index.astro          # card grid (joins downloads → chips, visuals → logo)
    apps/[id].astro      # detail page (joins downloads/guides/visuals/stats by app id)
  lib/url.ts             # GitHub Pages base-path helper
public/apps/<id>/        # logo, screenshots, guides (served statically)
CONTENT.md               # editing surface: the 4 tables in Markdown
templates/app.template.md
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
- **TNE Case:** build the Windows `.exe` installer and upload to Releases; move the macOS zip to Releases,
  then point the `downloads.json` rows at the direct asset URLs.
- Add real in-game screenshots as rows in `screenshots.json` (currently a placeholder).
