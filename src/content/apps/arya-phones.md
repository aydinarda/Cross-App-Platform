---
title: Arya Phones — Supplier Selection Game
tagline: Multiplayer classroom supplier-selection simulation
description: Competing teams pick smartphone-component suppliers to maximize profit or utility under environmental and social risk caps, while a facilitator runs live rounds.
category: Simulation Game
status: down # temporarily offline — flip to live/beta once it's back up
order: 3
accent: '#ef4444'
repo: https://github.com/aydinarda/AryaPhoneSupp
---

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

### Constraints
- Average environmental risk ≤ **3.25**
- Average social risk ≤ **3.5**
- At least **1** supplier selected

Only feasible submissions enter the final ranking.

### Tech
- **Backend:** Python + FastAPI + Uvicorn
- **Frontend:** Vanilla JS / HTML / CSS (no build step)
- **Database:** Supabase (PostgreSQL)
- **Real-time:** WebSockets · **Charts:** Plotly

> The hosted instance is temporarily offline. When it's running on Render's free tier, the first
> request after an idle period can take a few seconds (cold start).
