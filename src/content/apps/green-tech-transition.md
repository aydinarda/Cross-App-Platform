---
title: Green Tech Transition Game
tagline: Multiplayer classroom green-investment simulation
description: Teams decide how much to invest in green capacity against uncertain green demand, balancing under-investment (lost customers) against over-investment (wasted capacity), while a facilitator runs live rounds.
category: Simulation Game
status: live # temporarily offline — flip to live/beta once it's back up
order: 4
accent: '#16a34a'
repo: https://github.com/aydinarda/SimpleGreenTechTransition
---

**Green Tech Transition Game** is a classroom simulation about investing in green technology under
uncertainty. Each round a random level of green demand appears; players choose how much capacity to
invest in. Under-investors lose green customers, over-investors waste capacity — and residual green
demand can be picked up (or "stolen") by others. A facilitator configures the parameters and runs the
game round by round.

### How to play
1. The facilitator creates a game, sets the parameters (green-demand range, number of rounds, rewards
   and penalties), and shares the **room code**.
2. Players join with a name and wait in the lobby.
3. The facilitator starts a round; each player submits their **green-tech investment**.
4. The facilitator resolves the round → demand is revealed, allocation is computed, and rewards /
   penalties are scored on a live leaderboard.
5. Repeat for the configured number of rounds, then review the **final results**.

### Tech
- **Backend:** Python + FastAPI + Uvicorn · market logic with **NumPy**
- **Frontend:** Vanilla JS / HTML / CSS (no build step)
- **Database:** SQLAlchemy + `databases` (PostgreSQL / SQLite)
- **Hosting:** Render (free tier)

> The hosted instance is temporarily offline. When it's running on Render's free tier, the first
> request after an idle period can take a few seconds (cold start).
