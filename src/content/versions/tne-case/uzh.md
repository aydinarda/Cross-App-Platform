---
app: tne-case
label: UZH Edition
tagline: Web-native multiplayer puzzle with class rooms and a live leaderboard
status: live
default: true
order: 1
repo: https://github.com/TNE-CASE/TNEv2-web
draft: true # hidden until the live Render URL is added to downloads.json as "tne-case-uzh-web"
---

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
