---
# NEW APP — "apps" table row (frontmatter) + long description (body)
# 1) Copy this file to  src/content/apps/<id>.md  (<id> = url-friendly short name, e.g. my-game).
# 2) Fill in the base fields below.
# 3) Add the app's rows in the data tables (set app = "<id>" on each row):
#       src/data/downloads.json   (one row per platform: web/macos/windows/linux)
#       src/data/guides.json      (one row per guide)
#       src/data/stats.json       (optional: exposed stats, static or live-via-CORS)
# 4) Drop images into  public/apps/<id>/  — logo.png + screenshots/* are auto-discovered (no JSON).
#    Put guides under  public/apps/<id>/guides/.
# 5) Upload large .app/.exe files to GitHub Releases; only link them in downloads.json.

title: App Name
tagline: One-line pitch
description: Short description shown on the card.
category: Game # e.g. Simulation Game / Tool / Optimization
status: live # live | beta | wip
featured: false
order: 99 # home page order (smaller = first)
accent: '#5b8cff' # card accent color (optional)
repo: https://github.com/<owner>/<repo>
---

Put the app's **long description** here (Markdown). It is shown on the detail page.

### Features
- ...

### How to use
1. ...
