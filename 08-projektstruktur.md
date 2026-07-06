# Projektstruktur — City Baron

```
city-baron/
├── package.json                      # Monorepo Root
├── pnpm-workspace.yaml               # Workspace-Konfiguration
├── turbo.json                        # Turborepo-Konfiguration
├── .gitignore
├── README.md
│
├── packages/
│   ├── server/                       # ─── BACKEND ───
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── src/
│   │       ├── main.ts               # Server-Entry
│   │       ├── config.ts             # Konfiguration
│   │       │
│   │       ├── domain/               # PURE GAME LOGIC
│   │       │   ├── models/
│   │       │   │   ├── district.ts
│   │       │   │   ├── property.ts
│   │       │   │   ├── player.ts
│   │       │   │   ├── game.ts
│   │       │   │   └── loan.ts
│   │       │   ├── economy/
│   │       │   │   ├── pricing.ts        # Preisberechnungen
│   │       │   │   ├── rent.ts           # Mietberechnungen
│   │       │   │   ├── maintenance.ts    # Unterhaltskosten
│   │       │   │   ├── taxes.ts          # Steuern
│   │       │   │   └── loans.ts          # Kreditlogik
│   │       │   ├── events/
│   │       │   │   ├── event-types.ts
│   │       │   │   └── event-effects.ts
│   │       │   ├── bonuses/
│   │       │   │   └── synergy.ts        # Quartiersboni
│   │       │   └── market/
│   │       │       ├── market-cycle.ts   # Marktzyklen
│   │       │       └── price-engine.ts   # Dynamische Preise
│   │       │
│   │       ├── application/           # USE CASES
│   │       │   ├── game/
│   │       │   │   ├── game-service.ts      # Spiel-Logik
│   │       │   │   ├── game-init.ts         # Spiel-Initialisierung
│   │       │   │   └── turn-service.ts      # Rundenabwicklung
│   │       │   ├── player/
│   │       │   │   ├── buy-service.ts       # Kaufen
│   │       │   │   ├── sell-service.ts      # Verkaufen
│   │       │   │   ├── build-service.ts     # Bauen
│   │       │   │   ├── renovate-service.ts  # Sanieren
│   │       │   │   └── loan-service.ts      # Kredite
│   │       │   ├── combat/
│   │       │   │   ├── bidding-war.ts       # Bieterschlacht
│   │       │   │   ├── hostile-takeover.ts  # Feindl. Übernahme
│   │       │   │   └── lobbying.ts          # Lobbyismus
│   │       │   └── bot/
│   │       │       ├── bot-engine.ts        # Bot-Hauptlogik
│   │       │       ├── personalities.ts     # Persönlichkeiten
│   │       │       └── bot-decisions.ts     # Entscheidungsfindung
│   │       │
│   │       ├── infrastructure/        # FRAMEWORKS
│   │       │   ├── database/
│   │       │   │   ├── prisma-client.ts
│   │       │   │   └── repositories/
│   │       │   │       ├── game-repo.ts
│   │       │   │       ├── player-repo.ts
│   │       │   │       ├── property-repo.ts
│   │       │   │       └── district-repo.ts
│   │       │   ├── websocket/
│   │       │   │   └── socket-handler.ts
│   │       │   └── http/
│   │       │       └── express-app.ts
│   │       │
│   │       └── presentation/          # API
│   │           ├── routes/
│   │           │   ├── game.routes.ts
│   │           │   ├── player.routes.ts
│   │           │   ├── market.routes.ts
│   │           │   └── bank.routes.ts
│   │           ├── middleware/
│   │           │   └── auth.ts
│   │           └── ws/
│   │               └── game-ws-handler.ts
│   │
│   └── client/                        # ─── FRONTEND ───
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── vite.config.ts
│       ├── index.html
│       └── src/
│           ├── main.tsx               # Entry Point
│           ├── App.tsx                # Root Component
│           │
│           ├── types/                 # TypeScript-Typen
│           │   ├── game.ts
│           │   ├── property.ts
│           │   ├── district.ts
│           │   ├── player.ts
│           │   └── events.ts
│           │
│           ├── store/                 # State-Management
│           │   ├── game-store.ts      # Zustand-Store
│           │   ├── player-store.ts
│           │   └── ui-store.ts
│           │
│           ├── services/              # API + WS
│           │   ├── api.ts             # REST-API-Client
│           │   ├── socket.ts          # WebSocket-Client
│           │   └── game-sync.ts       # Sync-Logik
│           │
│           ├── hooks/                 # React-Hooks
│           │   ├── useGame.ts
│           │   ├── useSocket.ts
│           │   ├── useMap.ts
│           │   └── useKeyboard.ts
│           │
│           ├── engine/                # Client Engine
│           │   ├── map-renderer.ts    # Karten-Rendering
│           │   ├── heatmap.ts         # Heatmap-Logik
│           │   └── animations.ts      # Animationen
│           │
│           ├── components/            # UI-Komponenten
│           │   ├── hud/
│           │   │   ├── ResourceBar.tsx
│           │   │   ├── TurnCounter.tsx
│           │   │   └── GameMenu.tsx
│           │   │
│           │   ├── map/
│           │   │   ├── CityMap.tsx
│           │   │   ├── DistrictCard.tsx
│           │   │   ├── PropertyMarker.tsx
│           │   │   └── HeatmapToggle.tsx
│           │   │
│           │   ├── portfolio/
│           │   │   ├── PortfolioPanel.tsx
│           │   │   ├── PropertyCard.tsx
│           │   │   └── PortfolioChart.tsx
│           │   │
│           │   ├── market/
│           │   │   ├── MarketOverview.tsx
│           │   │   ├── DistrictDetail.tsx
│           │   │   └── PriceHistory.tsx
│           │   │
│           │   ├── bank/
│           │   │   ├── BankingPanel.tsx
│           │   │   ├── LoanCalculator.tsx
│           │   │   └── CreditRating.tsx
│           │   │
│           │   ├── actions/
│           │   │   ├── ActionPanel.tsx
│           │   │   ├── BuyDialog.tsx
│           │   │   ├── BuildDialog.tsx
│           │   │   ├── RenovateDialog.tsx
│           │   │   └── BiddingWarDialog.tsx
│           │   │
│           │   ├── opponents/
│           │   │   ├── OpponentList.tsx
│           │   │   ├── OpponentCard.tsx
│           │   │   └── OpponentDetail.tsx
│           │   │
│           │   ├── events/
│           │   │   ├── EventModal.tsx
│           │   │   └── EventLog.tsx
│           │   │
│           │   └── layout/
│           │       ├── GameLayout.tsx
│           │       ├── Sidebar.tsx
│           │       └── MainPanel.tsx
│           │
│           └── styles/
│               ├── globals.css
│               ├── variables.css
│               └── components/