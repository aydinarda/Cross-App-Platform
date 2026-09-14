# CONTENT — editing surface (separate tables)

The data is **normalized** into separate tables. Edit the **5 tables** below and hand the file back;
the values get transferred into the matching collection files. The tables are linked by `app` (= app id) —
i.e. each version / download / guide / stat row belongs to the app whose `id` it carries (a foreign key).

| Table | File | One row = |
|---|---|---|
| **Apps** | `src/content/apps/<id>.md` | an app (base fields + long description) |
| **Versions** | `src/content/versions/<id>/<slug>.md` | an optional parallel edition of an app |
| **Downloads** | `src/data/downloads.json` | one app+platform download/play link |
| **Guides** | `src/data/guides.json` | one guide / resource |
| **Stats** | `src/data/stats.json` | one exposed statistic |

> **Images are automatic — no table.** Just drop files into `public/apps/<id>/` and they're picked up at build:
> `logo.png` (card + detail logo) and everything in `screenshots/` (gallery). See the "Images" note below.

**Rules**
- Leave unknown values as `<<FILL: ...>>`. Delete rows that don't apply (don't leave blank rows).
- The `app` column must **exactly** match an `id` in the Apps table.
- The `version` column is optional. Leave it empty for rows shared by the whole app; otherwise it must
  **exactly** match an `id` in the Versions table (`<app>/<slug>`, e.g. `tne-case/uzh`).
- Put guides under `public/apps/<id>/guides/` (or hand them to me and I'll place them).
- For large `.app`/`.exe`/`.zip`, upload to GitHub Releases and put only the link in Downloads.

---

## TABLE 1 — Apps

> Base info. `status`: live | beta | wip | down (= temporarily offline, red badge) | preparation (= announced, not built yet, indigo badge) · `featured`: true|false · `order`: smaller = first · `accent`: hex color.
> (No logo column — the logo is auto-loaded from `public/apps/<id>/logo.png`.)
> To **hide** an app, add `draft: true` to its `src/content/apps/<id>.md` frontmatter (no card, no page).
> Apps with **versions** (Table 1b) show the default version's status on the card, and `repo` lives on each version.

| id | title | tagline | description | category | status | featured | order | accent | repo |
|----|-------|---------|-------------|----------|--------|----------|-------|--------|------|
| newsvendor | Simple Newsvendor Game | Multiplayer in-class inventory (newsvendor) simulation | Students place orders against a shared random demand; an admin runs the game round by round. | Simulation Game | live | true | 1 | #5b8cff | https://github.com/aydinarda/SimpleNewsVendorGame |
| tne-case | TNE Case | Global supply-chain network design case — cost vs. CO₂ | Students design a global supply-chain network across the SC1/SC2 scenarios, balancing total cost against CO₂ emissions. | Simulation / Optimization | live | false | 2 | #34d399 | _(per version)_ |
| arya-phones | Arya Phones — Supplier Selection Game | Multiplayer classroom supplier-selection simulation | Competing teams pick smartphone-component suppliers to maximize profit or utility under environmental and social risk caps, while a facilitator runs live rounds. | Simulation Game | down | false | 3 | #ef4444 | https://github.com/aydinarda/AryaPhoneSupp |
| green-tech-transition | Green Tech Transition Game | Multiplayer classroom green-investment simulation | Teams decide how much to invest in green capacity against uncertain green demand, balancing under-investment (lost customers) against over-investment (wasted capacity), while a facilitator runs live rounds. | Simulation Game | down | false | 4 | #16a34a | https://github.com/aydinarda/SimpleGreenTechTransition |
| order-up-to | Order-Up-To Inventory Game | Black Sea Gold — the multiplayer hazelnut supply challenge | Players restock a city hub each round via slow, cheap trucks or fast, costly vans — balancing service, profit and CO₂ under lead-time delays. | Simulation Game | live | false | 5 | #818cf8 | _(none yet)_ |
| cap-and-trade | Carbon Cap & Trade Game | Multiplayer classroom cap-and-trade carbon market simulation | Students run companies under an emission cap; the instructor allocates allowances and the class trades carbon credits in a live market across game years. | Simulation Game | live | false | 6 | #0d9488 | https://github.com/aydinarda/Carb-Cap-Trade-Game |

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

<details><summary><code>tne-case</code> — long description (shared overview, shown on every version)</summary>

```markdown
**TNE Case** is a supply-chain network design case: choose facilities, allocate production and pick
transport modes to meet global demand at the lowest total cost and CO₂. It comes in parallel
**editions** — pick one with the tabs above.
```
</details>

<details><summary><code>arya-phones</code> — long description</summary>

```markdown
**Arya Phones — Supplier Selection Game** is a classroom simulation where competing teams choose
smartphone-component suppliers to maximize profit or utility, subject to environmental and social
risk caps. A facilitator manages sessions and rounds; results appear on a live leaderboard updated
in real time over WebSockets.

### How to play
1. The facilitator opens **Admin**, creates a session, and shares the short **session code**.
2. Players join with a team name and the session code, then wait in the lobby.
3. The facilitator starts a round; players select suppliers and set a price per user.
4. Players **Evaluate** to preview their metrics, then **Submit** to lock in.
5. The facilitator runs **Market Matching** (MNL demand) and reviews the leaderboard.

### Tech
- Backend: Python + FastAPI + Uvicorn
- Frontend: Vanilla JS / HTML / CSS (no build step)
- Database: Supabase (PostgreSQL)
- Real-time: WebSockets · Charts: Plotly

> The hosted instance is temporarily offline (status: down).
```
</details>

<details><summary><code>green-tech-transition</code> — long description</summary>

```markdown
**Green Tech Transition Game** is a classroom simulation about investing in green technology under
uncertainty. Each round a random level of green demand appears; players choose how much capacity to
invest in. Under-investors lose green customers, over-investors waste capacity — and residual green
demand can be picked up (or "stolen") by others. A facilitator configures the parameters and runs the
game round by round.

### How to play
1. The facilitator creates a game, sets the parameters (green-demand range, number of rounds, rewards
   and penalties), and shares the room code.
2. Players join with a name and wait in the lobby.
3. The facilitator starts a round; each player submits their green-tech investment.
4. The facilitator resolves the round → demand is revealed, allocation is computed, and rewards /
   penalties are scored on a live leaderboard.
5. Repeat for the configured number of rounds, then review the final results.

### Tech
- Backend: Python + FastAPI + Uvicorn · market logic with NumPy
- Frontend: Vanilla JS / HTML / CSS (no build step)
- Database: SQLAlchemy + databases (PostgreSQL / SQLite)
- Hosting: Render (free tier)

> The hosted instance is temporarily offline (status: down).
```
</details>

<details><summary><code>cap-and-trade</code> — long description</summary>

```markdown
**Carbon Cap & Trade Game** is a real-time multiplayer cap-and-trade carbon simulation for the
classroom. Students run companies in an industry they pick at join (a ten-year emission history is
generated for that industry); the instructor allocates emission allowances under a cap mechanism and
steps the class through game years: cap stage (allocation or auction) → emission reveal → student
market → penalty settlement.

Prices are not set by the game — they come entirely from the students' own order book, with the
penalty rate acting as the ceiling.

### Cap mechanisms
- **Grandfathering** — free credits proportional to each company's emission history; the cap is 80%
  of the class baseline.
- **Benchmarking** — every company in a sector gets the same free credits, set 40% below the sector
  average, tightening each year. No primary sale: close the gap by cutting emissions or on the market.
- **Auctioning** — no free credits; a single-round sealed-bid uniform-price auction sells a supply
  that shrinks each year.

The instructor can switch the mechanism in the lobby and between years, so one class can compare all
three on the same roster.

### How to play
1. The instructor opens `/host`, picks the cap mechanism, enters the host key and creates a session.
2. Students join at the site root with the 4-letter room code and pick an industry — that draws
   their ten-year emission history.
3. **Start Year 11** locks the roster and allocates free credits.
4. **Cap stage** — under auctioning students submit a sealed bid (quantity + max price); under the
   other two there is nothing to submit, the panel just shows the allocation and the gap it leaves.
5. **Open the market** — students post limit buy/sell orders and the book matches them live.
6. **Close market & settle** — emissions are realized, uncovered tonnes are charged the penalty rate,
   surpluses are banked, and the leaderboard updates.
7. Repeat for the next year, or end the game for the final leaderboard.

Each company also chooses how much to abate against its sector's marginal abatement cost curve —
optimal play is where marginal cost meets the carbon price. Scores are cumulative costs, and the
leaderboard ranks players by distance from their own optimum, so it measures skill rather than which
industry they drew.

### Tech
- **Frontend:** React + Vite
- **Backend:** Express + Socket.IO
- **Deploy:** split frontend (static site) + backend (web service) on Render

All game logic runs server-side; clients render role-scoped snapshots, so players never see others'
private numbers or unrevealed emissions. Optional market bots (compliance, market maker, speculator,
noise) can be added in the lobby to keep the order book two-sided in a small class.
```
</details>

<details><summary><code>order-up-to</code> — long description</summary>

```markdown
A multiplayer **order-up-to (base-stock)** inventory simulation, themed as **Black Sea Gold — The
Hazelnut Supply Challenge**. Run the cooperative's city hub through the autumn season: keep the
shelves stocked with premium hazelnuts while holding down transport emissions and excess inventory.
It's the multi-period sibling of the Newsvendor game, built for classroom use.

Each round you decide how to replenish using two shipment modes:
- Consolidated truck — cheaper, lower-emission and higher-capacity, but it only arrives after the
  configured lead time.
- Express van — arrives next round with less capacity, at a higher cost and higher CO₂ per unit.

Demand during the wait can turn into lost sales, so every order trades off service level, profit and CO₂.

### How to play
1. The admin creates an active game with the admin key, picks the number of rounds, and shares the
   link; students join with a nickname.
2. The admin sets parameters — demand distribution, lead time, price, unit/holding costs, truck & van
   capacities and costs, CO₂ per shipment, and shipping-delay chance — and can broadcast announcements.
3. Each round players see on-hand stock and in-transit shipments, then order via consolidated trucks
   and/or express vans. (The opening order always has lead time 1, so play effectively starts in round 2.)
4. The admin ends the round → realized demand, profit, service level, lost sales and CO₂ update.
5. The leaderboard ranks players; to win you must finish on the Pareto front — not beaten on both
   profit and CO₂ by anyone.

### Tech
- Frontend: React + Vite
- Backend: Express + WebSocket
- Persistence (optional): Supabase PostgreSQL
```
</details>

---

## TABLE 1b — Versions

> Optional — only for apps that ship **parallel editions** at the same time. Apps without rows here are unaffected.
> `id` = `<app>/<slug>` (file `src/content/versions/<app>/<slug>.md`, page `/apps/<app>/<slug>`) ·
> `label` = tab name · `default`: exactly one `true` per app (shown at `/apps/<app>` and on the card) ·
> `order`: tab order · `tagline` / `status` / `repo` override the app's · `draft: true` hides the version.

| id | app | label | tagline | status | default | order | repo | draft |
|----|-----|-------|---------|--------|---------|-------|------|-------|
| tne-case/uzh | tne-case | UZH Edition | Web-native multiplayer puzzle with class rooms and a live leaderboard | live | true | 1 | https://github.com/TNE-CASE/TNEv2-web | true _(until the live URL is added)_ |
| tne-case/desktop | tne-case | Desktop | Streamlit + Gurobi optimization suite, packaged as a desktop app | preparation | false | 2 | https://github.com/TNE-CASE/TGE_CASE-web-page | false |

**Version long descriptions** (shown below the app's shared overview):

<details><summary><code>tne-case/uzh</code> — long description</summary>

```markdown
The **UZH Edition** (Supply-Chain Puzzle) is a web-native, multiplayer version of the TNE Case.
Players join a room with a **class code**, build a supply-chain network — facilities, production
allocation and transport modes — to satisfy **111,000 units** of demand at the lowest **cost and
CO₂**, and compete on a **live leaderboard**. It runs in the browser: no installation and no Gurobi
license needed.

### How to play
1. The host creates a room (a room-creation code may be required) and shares the class code.
2. Players join with the class code and a nickname.
3. Each player builds a network and evaluates its cost and CO₂.
4. Submissions appear on the live leaderboard; players iterate to improve their trade-off.

### Host view
- Per-player best submissions and summaries
- Pareto front of cost vs. CO₂ across the class
- Read-only SC1 / SC2 dashboards served from precomputed results

### Tech
- Backend: FastAPI + WebSocket, SQLAlchemy (Postgres), pandas / pyarrow
- Frontend: React + Vite + TypeScript, Plotly
- Deploy: Render (static frontend + Python web service + Postgres)
```
</details>

<details><summary><code>tne-case/desktop</code> — long description</summary>

```markdown
The **Desktop** edition (TGECase) is the original single-user Streamlit application with a Gurobi
optimization engine, packaged with PyInstaller for macOS and Windows.

### Scenarios
- **SC1 / SC2** demand-level simulations
- Optimization module (`optimize/`)
- Single-page run mode

### Download & install
Builds are distributed as `.zip` files for macOS (Apple Silicon) and Windows. After unzipping, run
`TNECase.app` on macOS or the `TNECase` executable on Windows.

> Large binaries are not kept in the repo; every release is distributed via **GitHub Releases**.
```
</details>

---

## TABLE 2 — Downloads

> One row per download/play button. `platform`: web | macos | windows | linux ·
> `web` → "Play in Browser" link, desktop → download link (Releases).
> `version` = which edition the row belongs to (empty = shared by the whole app).
> `note` / `size` / `release` = small text under the button (optional; `release` is a build number, shown as `v1.2.0`).

| app | version | platform | url | size | note | release |
|-----|---------|----------|-----|------|------|---------|
| newsvendor | | web | `<<FILL: live Render URL, e.g. https://newsvendor.onrender.com>>` | | | |
| tne-case | tne-case/uzh | web | `<<FILL: live scp-frontend Render URL>>` | | | |
| tne-case | tne-case/desktop | macos | `<<FILL: Releases .zip link>>` | 175 MB | Apple Silicon (.zip) | |
| tne-case | tne-case/desktop | windows | `<<FILL: Releases .zip link>>` | 200 MB | Windows (.zip) | |
| arya-phones | | web | https://aryaphonesupp.onrender.com | | Temporarily offline — hosted instance is currently down | |
| green-tech-transition | | web | https://simplegreentechtransition.onrender.com | | Temporarily offline — hosted instance is currently down | |
| order-up-to | | web | https://order-up-to.onrender.com/ | | | |
| cap-and-trade | | web | https://carb-cap-trade-game.onrender.com | | Instructor screen: /host | |

---

## TABLE 3 — Guides

> One row per guide/resource. `type`: admin | user | build | other.
> `url` is either `/apps/<id>/guides/...` (local file) or an external link.
> `version` = which edition the guide belongs to (empty = shared by the whole app).

| app | version | type | label | url |
|-----|---------|------|-------|-----|
| newsvendor | | admin | Admin Guide (.docx) | /apps/newsvendor/guides/admin-guide.docx |
| newsvendor | | user | `<<FILL: is there a User Guide?>>` | `<<FILL>>` |
| tne-case | tne-case/desktop | build | Build Guide (README_BUILD) | https://github.com/TNE-CASE/TGE_CASE-web-page/blob/main/README_BUILD.md |
| tne-case | `<<FILL: tne-case/uzh or tne-case/desktop>>` | user | `<<FILL: is there a User Guide?>>` | `<<FILL>>` |
| arya-phones | | admin | Admin Guide (.pdf) | /apps/arya-phones/guides/admin-guide.pdf |
| order-up-to | | admin | Admin Guide (.pdf) | /apps/order-up-to/guides/admin-guide.pdf |
| cap-and-trade | | admin | Admin Guide (.docx) | /apps/cap-and-trade/guides/admin-guide.docx |

> Note: `repo` is not a separate table — it's the `repo` column in the Apps (or Versions) table. It's added
> automatically on the detail page as "Source code (repo)".

---

## Images (automatic — no table)

There is **no visuals table**. Logo and screenshots are auto-discovered from the filesystem at build:

- **Logo:** drop `public/apps/<id>/logo.png` → used on the card and detail page.
- **Screenshots:** drop any images into `public/apps/<id>/screenshots/` → all shown in the gallery.
  - Sorted by filename. To control order, prefix with numbers: `01-home.png`, `02-start.png`, …
  - The caption is auto-derived from the filename (`01-Home-Page.png` → "Home Page").
- **Per version (optional):** `public/apps/<id>/<slug>/logo.png` and `public/apps/<id>/<slug>/screenshots/`
  replace the app's logo / screenshots on that version's page (e.g. `public/apps/tne-case/uzh/screenshots/`).

Just add/remove files — nothing to edit here. (Filenames are case-sensitive on the live site.)

---

## TABLE 4 — Stats

> Exposed per-app statistics. `source`:
> - **static** → `value` is shown as-is (you maintain it by hand). Use this for desktop / self-contained apps.
> - **live** → the browser fetches `url` and reads `field` (a dot-path into the JSON) to update the value.
>   The app must expose a **public, CORS-enabled** JSON endpoint (e.g. the newsvendor backend's `/health`
>   or `/stats`). `value` is used as the fallback until the fetch returns. `suffix` is an optional unit.
> `version` = which edition the stat belongs to (empty = shared by the whole app).

> **Planned — none live yet.** `src/data/stats.json` is currently an empty `[]`. We'll add real
> metrics here in the future (e.g. how many times an app was visited, how many users, games played,
> etc.). Add a row below for each stat you want shown, then it gets transferred into `stats.json`.
> (Reminder: `.json` can't hold comments — keep notes like this here in CONTENT.md, not in the data file.)

| app | version | label | value | suffix | icon | source | url | field |
|-----|---------|-------|-------|--------|------|--------|-----|-------|
| `<<FILL: app id>>` | | `<<FILL: e.g. Visits>>` | `<<FILL>>` | | 📊 | static | | |

> Reminder: the site is **static** (GitHub Pages), so it cannot count anything itself. `live` stats are
> fetched **in the visitor's browser** at view time — only works if the app's endpoint is public + CORS-enabled.

---

## Adding a new app

1. Add a new row to **Apps** (with a new `id`) and a long-description block under it.
2. If the app has parallel editions, add one row per edition to **Versions** (mark one `default`) with
   its own long-description block.
3. For that `id`, add the relevant rows to **Downloads / Guides / Stats** (fill `version` for edition-specific rows).
4. Drop images into `public/apps/<id>/` (`logo.png` + `screenshots/*`) and guides into `guides/` — images auto-load.

Hand the file back and I'll transfer it into `src/content/apps/<id>.md`, `src/content/versions/<id>/*.md`
and `src/data/*.json`, then verify with `pnpm build`.
