---
title: Risk Pooling
tagline: Interactive classroom games on risk pooling strategies for Operations Management.
description: A host creates a game, players join with a room code, and the class explores how merging depots reduces uncertainty and costs.
category: Simulation Game
status: live # approved by you on 2026-11-22
featured: false
order: 7
accent: '#a855f7'
repo: https://github.com/aydinarda/riskpooling
---

This app simulates **location pooling** where students merge depots on a map to balance inventory targets against holding and shipping costs. It demonstrates that **total demand variability is lower than individual location variability**, reducing the need for safety stock.

### Features
- Interactive map with territories, depots, and distribution centers (DCs).
- Visual feedback on lead times: grey lines for 1-day delivery, orange for longer.
- Real-time calculation of holding, shipping, and expected stockout costs.
- Host controls game flow via presets like the Medtronic case study.
- Drag-and-drop mechanics to merge depots or un-pool inventory.

### How to play
1. The host starts the server using 'npm start' and creates a new game session.
2. Students join the class by entering the room code provided by the host.
3. The host switches between parameter presets, such as the baseline Medtronic case.
4. Players drag depots to merge them or place them in empty locations to test strategies.
5. The system calculates and displays the trade-offs between service levels and costs.
6. The host concludes the session by reviewing the optimal pooling configuration.

### Tech
- Frontend: JavaScript, CSS, HTML
- Frontend: React components for game logic and UI rendering
- Frontend: SVG graphics for map elements and brand marks
