---
title: Carbon Cap & Trade Game
tagline: Multiplayer classroom cap-and-trade carbon market simulation
description: Students run companies under an emission cap; the instructor allocates allowances and the class trades carbon credits in a live market across game years.
category: Simulation Game
status: live
order: 6
accent: '#0d9488'
repo: https://github.com/aydinarda/Carb-Cap-Trade-Game
---

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
