---
# NEW VERSION — "versions" table row (frontmatter) + version-specific long description (body)
# Use versions when one app has parallel editions (e.g. a desktop and a web edition).
# Apps without version files keep working exactly as before.
# 1) Copy this file to  src/content/versions/<app-id>/<slug>.md
#    (<slug> = url-friendly short name, e.g. uzh → page /apps/<app-id>/<slug>; not "guides"/"screenshots").
# 2) Fill in the fields below. Mark exactly one version of the app as `default: true`.
# 3) In the data tables, set "version": "<app-id>/<slug>" on rows that belong only to this version
#    (downloads.json / guides.json / stats.json). Rows without "version" show on every version.
# 4) Optional images: public/apps/<app-id>/<slug>/logo.png and .../<slug>/screenshots/*
#    (otherwise the app's logo and screenshots are used).
# Don't add a `slug:` field — the slug comes from the file name.

app: app-id # must match the folder name
label: Web Edition # tab label
tagline: One-line pitch for this version # optional, falls back to the app's
status: live # live | beta | wip | down | preparation
default: false # true = shown at /apps/<app-id> and on the card
order: 1 # tab order (smaller = first)
repo: https://github.com/<owner>/<repo> # optional, falls back to the app's
---

What is specific to **this version** (Markdown). It is shown below the app's shared overview.

### How to play
1. ...
