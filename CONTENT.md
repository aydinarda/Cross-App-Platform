# CONTENT — editing surface (separate tables)

The data is **normalized** into separate tables. Edit the **4 tables** below and hand the file back;
the values get transferred into the matching collection files. The tables are linked by `app` (= app id) —
i.e. each download / guide / stat row belongs to the app whose `id` it carries (a foreign key).

| Table | File | One row = |
|---|---|---|
| **Apps** | `src/content/apps/<id>.md` | an app (base fields + long description) |
| **Downloads** | `src/data/downloads.json` | one app+platform download/play link |
| **Guides** | `src/data/guides.json` | one guide / resource |
| **Stats** | `src/data/stats.json` | one exposed statistic |

> **Images are automatic — no table.** Just drop files into `public/apps/<id>/` and they're picked up at build:
> `logo.png` (card + detail logo) and everything in `screenshots/` (gallery). See the "Images" note below.

**Rules**
- Leave unknown values as `<<FILL: ...>>`. Delete rows that don't apply (don't leave blank rows).
- The `app` column must **exactly** match an `id` in the Apps table.
- Put guides under `public/apps/<id>/guides/` (or hand them to me and I'll place them).
- For large `.app`/`.exe`/`.zip`, upload to GitHub Releases and put only the link in Downloads.

---

## TABLE 1 — Apps

> Base info. `status`: live | beta | wip · `featured`: true|false · `order`: smaller = first · `accent`: hex color.
> (No logo column — the logo is auto-loaded from `public/apps/<id>/logo.png`.)
> To **hide** an app, add `draft: true` to its `src/content/apps/<id>.md` frontmatter (no card, no page). Currently: `tne-case` is hidden.

| id | title | tagline | description | category | status | featured | order | accent | repo |
|----|-------|---------|-------------|----------|--------|----------|-------|--------|------|
| newsvendor | Simple Newsvendor Game | Multiplayer in-class inventory (newsvendor) simulation | Students place orders against a shared random demand; an admin runs the game round by round. | Simulation Game | live | true | 1 | #5b8cff | https://github.com/aydinarda/SimpleNewsVendorGame |
| tne-case | TNE Case (TGECase) | Demand & scenario simulation desktop app | A Streamlit-based, packaged desktop simulation/optimization application. | Simulation / Optimization | live | false | 2 | #34d399 | https://github.com/TNE-CASE/TGE_CASE-web-page |

**Long descriptions** (each app's detail-page body — Markdown). These don't fit in a table cell, so they live in their own blocks:

<details><summary><code>newsvendor</code> — long description</summary>

```markdown
A multiplayer **newsvendor** simulation — designed for classroom use. Students enter inventory
orders against a shared, randomized demand; an admin advances the game one round at a time.

### How to play
1. The admin creates a game; students join with a nickname.
2. The admin starts a round → players submit their orders.
3. The admin ends the round → results + leaderboard are shown.
4. Repeat for the configured number of rounds.

### Tech
- Frontend: React + Vite
- Backend: Express + WebSocket
- Persistence (optional): Supabase PostgreSQL
```
</details>

<details><summary><code>tne-case</code> — long description</summary>

```markdown
**TNE Case (TGECase)** — a simulation/optimization desktop app built with Streamlit and packaged
with PyInstaller as a macOS `.app` and a Windows installer.

### Scenarios
- SC1 / SC2 demand-level simulations
- Optimization module (`optimize/`)
- Single-page run mode

### Download & install
The macOS build is compiled for Apple Silicon; after unzipping, run `TNECase.app`. For Windows,
download the installer `.exe` from the Releases page.
```
</details>

---

## TABLE 2 — Downloads

> One row per download/play button. `platform`: web | macos | windows | linux ·
> `web` → "Play in Browser" link, desktop → download link (Releases).
> `note` / `size` / `version` = small text under the button (optional).

| app | platform | url | size | note | version |
|-----|----------|-----|------|------|---------|
| newsvendor | web | `<<FILL: live Render URL, e.g. https://newsvendor.onrender.com>>` | | | |
| tne-case | macos | `<<FILL: Releases .zip link>>` | 175 MB | Apple Silicon (.app) | |
| tne-case | windows | `<<FILL: Releases .exe link — build the installer first>>` | | Installer (.exe) | |

---

## TABLE 3 — Guides

> One row per guide/resource. `type`: admin | user | build | other.
> `url` is either `/apps/<id>/guides/...` (local file) or an external link.

| app | type | label | url |
|-----|------|-------|-----|
| newsvendor | admin | Admin Guide (.docx) | /apps/newsvendor/guides/admin-guide.docx |
| newsvendor | user | `<<FILL: is there a User Guide?>>` | `<<FILL>>` |
| tne-case | build | Build Guide (README_BUILD) | https://github.com/TNE-CASE/TGE_CASE-web-page/blob/main/README_BUILD.md |
| tne-case | user | `<<FILL: is there a User Guide?>>` | `<<FILL>>` |

> Note: `repo` is not a separate table — it's the `repo` column in the Apps table. It's added
> automatically on the detail page as "Source code (repo)".

---

## Images (automatic — no table)

There is **no visuals table**. Logo and screenshots are auto-discovered from the filesystem at build:

- **Logo:** drop `public/apps/<id>/logo.png` → used on the card and detail page.
- **Screenshots:** drop any images into `public/apps/<id>/screenshots/` → all shown in the gallery.
  - Sorted by filename. To control order, prefix with numbers: `01-home.png`, `02-start.png`, …
  - The caption is auto-derived from the filename (`01-Home-Page.png` → "Home Page").

Just add/remove files — nothing to edit here. (Filenames are case-sensitive on the live site.)

---

## TABLE 4 — Stats

> Exposed per-app statistics. `source`:
> - **static** → `value` is shown as-is (you maintain it by hand). Use this for desktop / self-contained apps.
> - **live** → the browser fetches `url` and reads `field` (a dot-path into the JSON) to update the value.
>   The app must expose a **public, CORS-enabled** JSON endpoint (e.g. the newsvendor backend's `/health`
>   or `/stats`). `value` is used as the fallback until the fetch returns. `suffix` is an optional unit.

| app | label | value | suffix | icon | source | url | field |
|-----|-------|-------|--------|------|--------|-----|-------|
| tne-case | Download size | 175 | MB | 💾 | static | | |
| tne-case | Platforms | macOS · Windows | | 🖥️ | static | | |
| newsvendor | Players online | 0 | | 👥 | live | `<<FILL: e.g. https://your-backend.onrender.com/health>>` | `<<FILL: JSON field, e.g. activePlayers>>` |
| newsvendor | Games played | `<<FILL: number or leave for live>>` | | 🎮 | static | | |

> Reminder: the site is **static** (GitHub Pages), so it cannot count anything itself. `live` stats are
> fetched **in the visitor's browser** at view time — only works if the app's endpoint is public + CORS-enabled.

---

## Adding a new app

1. Add a new row to **Apps** (with a new `id`) and a long-description block under it.
2. For that `id`, add the relevant rows to **Downloads / Guides / Stats**.
3. Drop images into `public/apps/<id>/` (`logo.png` + `screenshots/*`) and guides into `guides/` — images auto-load.

Hand the file back and I'll transfer it into `src/content/apps/<id>.md` + `src/data/*.json`, then verify
with `pnpm build`.
