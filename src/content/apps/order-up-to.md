---
title: Order-Up-To Inventory Game
tagline: Black Sea Gold — the multiplayer hazelnut supply challenge
description: Players restock a city hub each round via slow, cheap trucks or fast, costly vans — balancing service, profit and CO₂ under lead-time delays.
category: Simulation Game
status: live
featured: false
order: 5
accent: '#818cf8'
---

A multiplayer **order-up-to (base-stock)** inventory simulation, themed as **Black Sea Gold — The
Hazelnut Supply Challenge**. Run the cooperative's city hub through the autumn season: keep the
shelves stocked with premium hazelnuts while holding down transport emissions and excess inventory.
It's the multi-period sibling of the Newsvendor game, built for classroom use.

Each round you decide how to replenish using two shipment modes:
- **Consolidated truck** — cheaper, lower-emission and higher-capacity, but it only arrives after the
  configured **lead time**.
- **Express van** — arrives next round with less capacity, at a higher cost and higher CO₂ per unit.

Demand during the wait can turn into **lost sales**, so every order trades off service level, profit
and CO₂.

### How to play
1. The admin creates an active game with the admin key, picks the number of rounds, and shares the
   link; students join with a nickname.
2. The admin sets parameters — demand distribution, lead time, price, unit/holding costs, truck & van
   capacities and costs, CO₂ per shipment, and shipping-delay chance — and can broadcast
   announcements to the class.
3. Each round players see on-hand stock and in-transit shipments, then order via consolidated trucks
   and/or express vans. (The opening order always has lead time 1, so play effectively starts in
   round 2.)
4. The admin ends the round → realized demand, profit, service level, lost sales and CO₂ update.
5. The leaderboard ranks players; to win you must finish on the **Pareto front** — not beaten on both
   profit and CO₂ by anyone.

### Tech
- **Frontend:** React + Vite
- **Backend:** Express + WebSocket
- **Persistence (optional):** Supabase PostgreSQL

Extends the Simple Newsvendor architecture with per-player inventory state (on-hand + in-transit
pipeline), a two-mode shipment system, and a profit-vs-CO₂ Pareto leaderboard.
