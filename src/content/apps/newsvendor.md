---
title: Simple Newsvendor Game
tagline: Multiplayer in-class inventory (newsvendor) simulation
description: Students place orders against a shared random demand; an admin runs the game round by round.
category: Simulation Game
status: live
featured: true
order: 1
accent: '#5b8cff'
repo: https://github.com/aydinarda/SimpleNewsVendorGame
---

A multiplayer **newsvendor** simulation — designed for classroom use. Students enter inventory
orders against a shared, randomized demand; an admin advances the game one round at a time.

### How to play
1. The admin creates a game; students join with a nickname.
2. The admin starts a round → players submit their orders.
3. The admin ends the round → results + leaderboard are shown.
4. Repeat for the configured number of rounds.

### Tech
- **Frontend:** React + Vite
- **Backend:** Express + WebSocket
- **Persistence (optional):** Supabase PostgreSQL

Player sessions survive page refreshes via `localStorage` + URL parameters. One active game runs
per server instance.
