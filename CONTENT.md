# CONTENT — editing surface (separate tables)

The data is **normalized** into separate tables. Edit the **5 tables** below and hand the file back;
the values get transferred into the matching collection files. The tables are linked by `app` (= app id) —
i.e. each download / guide / visual / stat row belongs to the app whose `id` it carries (a foreign key).

| Table | File | One row = |
|---|---|---|
| **Apps** | `src/content/apps/<id>.md` | an app (base fields + long description) |
| **Downloads** | `src/data/downloads.json` | one app+platform download/play link |
| **Guides** | `src/data/guides.json` | one guide / resource |
| **Visuals** | `src/data/visuals.json` | one image (logo / icon / screenshot / background) |
| **Stats** | `src/data/stats.json` | one exposed statistic |

**Rules**
- Leave unknown values as `<<FILL: ...>>`. Delete rows that don't apply (don't leave blank rows).
- The `app` column must **exactly** match an `id` in the Apps table.
- Put images/guides under `public/apps/<id>/...` (or hand them to me and I'll place them).
- For large `.app`/`.exe`/`.zip`, upload to GitHub Releases and put only the link in Downloads.

---

## TABLE 1 — Apps

> Base info. `status`: live | beta | wip · `featured`: true|false · `order`: smaller = first · `accent`: hex color.
> (The logo is no longer here — it lives in the **Visuals** table as a `logo` row.)

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

## TABLE 4 — Visuals

> All imagery. `kind`: logo | icon | screenshot | background.
> The card uses the `logo` (or `icon`) row; the detail-page gallery uses `screenshot`/`background` rows.
> `file` = `/apps/<id>/...`. `caption` is optional.

| app | kind | file | caption |
|-----|------|------|---------|
| newsvendor | logo | /apps/newsvendor/logo.png | |
| newsvendor | screenshot | /apps/newsvendor/screenshots/background.png | Placeholder (background image) |
| newsvendor | screenshot | `<<FILL: real in-game screenshot>>` | |
| tne-case | logo | /apps/tne-case/logo.png | |
| tne-case | screenshot | `<<FILL: screenshot (none yet)>>` | |

---

## TABLE 5 — Stats

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
2. For that `id`, add the relevant rows to **Downloads / Guides / Visuals / Stats** (include a `logo` visual).
3. Put assets under `public/apps/<id>/`.

Hand the file back and I'll transfer it into `src/content/apps/<id>.md` + `src/data/*.json`, then verify
with `pnpm build`.
