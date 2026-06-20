---
title: Order-Up-To Inventory Game
tagline: Multiplayer classroom order-up-to (base-stock) simulation with lead time
description: Players set an order-up-to level each round; lead-time delays cause lost sales, and order frequency drives CO₂ emissions.
category: Simulation Game
status: preparation
featured: false
order: 5
accent: '#818cf8'
---

> **In preparation.** This game is being designed — the card is a placeholder while requirements
> and documentation are written. Check back soon.

A multiplayer **order-up-to (base-stock)** inventory simulation — the multi-period sibling of the
Newsvendor game, built for classroom use. Each round students set an **order-up-to level S**; the
system replenishes up to that level, but new stock only arrives after a **lead time**, so demand
during the wait can turn into **lost sales**. On top of profit, each shipment carries a **CO₂ cost**,
forcing the classic sustainability trade-off: order often for high service, or batch orders to cut
emissions.

### How it will work
1. The admin creates a game and sets the lead time, demand, and cost/CO₂ parameters; students join.
2. Each round, players see their on-hand stock and in-transit orders, then set their **order-up-to level S**.
3. Demand is realized; sales are filled from on-hand stock and unmet demand is **lost**.
4. Replenishment arrives after the configured **lead time** — patience (or buffer stock) is required.
5. Profit and **CO₂ emissions** update; the leaderboard ranks players round by round.

### Planned tech
- **Frontend:** React + Vite
- **Backend:** Express + WebSocket
- **Persistence (optional):** Supabase PostgreSQL

Mirrors the Simple Newsvendor Game architecture, extended with per-player inventory state (on-hand,
in-transit pipeline) and a CO₂ emissions tracker.
