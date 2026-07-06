# Architektur — City Baron

---

## 1. SYSTEMARCHITEKTUR

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                        │
│  ┌─────────────────────────────────────────────────┐     │
│  │           React App (Vite + TypeScript)          │     │
│  │  ┌───────┐ ┌────────┐ ┌──────────┐ ┌────────┐ │     │
│  │  │ Game  │ │ Render │ │ Network  │ │ UI     │ │     │
│  │  │Engine │ │ (PIXI) │ │ (Socket) │ │ (React)│ │     │
│  │  └───────┘ └────────┘ └──────────┘ └────────┘ │     │
│  └──────────────────────┬──────────────────────────┘     │
│                         │ WebSocket / REST                │
├─────────────────────────┼────────────────────────────────┤
│                   SERVER                                  │
│  ┌──────────────────────┴──────────────────────────┐     │
│  │           Node.js (Express + Socket.io)          │     │
│  │  ┌─────────┐ ┌──────────┐ ┌───────┐ ┌────────┐ │     │
│  │  │ Game    │ │ Auth     │ │ Bot   │ │ API    │ │     │
│  │  │ Logic   │ │ (JWT)    │ │Engine │ │ REST   │ │     │
│  │  └────┬────┘ └──────────┘ └───────┘ └────────┘ │     │
│  │       │                                          │     │
│  │  ┌────┴────────────────────────────┐              │     │
│  │  │         Prisma ORM              │              │     │
│  │  └────────────┬────────────────────┘              │     │
│  └───────────────┼───────────────────────────────────┘     │
│                  │                                         │
│  ┌───────────────┴───────────────────────────────────┐     │
│  │              PostgreSQL                             │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. SCHICHTENARCHITEKTUR (Server)

### 2.1 Domain Layer (Core)
- Spielregeln, Wirtschaftslogik, Immobilienlogik
- Keine Abhängigkeiten zu Frameworks
- Pure TypeScript-Funktionen

### 2.2 Application Layer (Use Cases)
- Orchestriert Domain-Logik für Spielaktionen
- Game-Service, Bank-Service, Bot-Service, Event-Service

### 2.3 Infrastructure Layer
- Prisma ORM → PostgreSQL
- Socket.io → Client-Kommunikation
- Express → REST-API

### 2.4 Presentation Layer (REST + WS)
- REST: Spielstatus, Aktionen, Lobby
- WebSocket: Echtzeit-Updates, Multiplayer

---

## 3. KOMPONENTENSTRUKTUR (Client)

```
src/
├── components/
│   ├── map/           # Stadtkarte, Bezirke
│   ├── portfolio/     # Eigenes Portfolio anzeigen
│   ├── market/        # Marktübersicht, Preise
│   ├── bank/          # Banking-Interface
│   ├── events/        # Event-Anzeige
│   ├── actions/       # Aktions-Panel
│   ├── opponents/     # Gegner-Übersicht
│   └── hud/           # Ressourcen-Leiste
├── engine/            # Spiel-Engine (Client-seitig)
├── hooks/             # React-Hooks
├── services/          # API + WebSocket-Services
├── store/             # State-Management (Zustand)
└── types/             # TypeScript-Typen
```

---

## 4. DATENFLUSS

```
Spieler klickt → React Event → Action Creator → Socket/API → Server
    → Game Logic validiert → Prisma speichert → Response zurück
    → Client-State aktualisiert → UI neu gerendert
```

---

## 5. MULTIPLAYER-READY VON ANFANG AN

- Game-Service ist zustandslos: Jeder Request enthält gameId
- Socket.io-Events sind nach Spiel getrennt (rooms)
- Spielstatus wird serverseitig validiert (kein Client-Trust)
- Bot-Engine läuft als eigener Service (modular austauschbar)
- Ticks: Serverseitiger Game-Loop statt Client-Seitig

---

## 6. PROJEKTSTRUKTUR (Monorepo)

```
city-baron/
├── package.json
├── packages/
│   ├── server/
│   │   ├── src/
│   │   │   ├── domain/       # Pure Game Logic
│   │   │   ├── application/  # Services / Use Cases
│   │   │   ├── infrastructure/ # DB, Socket, HTTP
│   │   │   ├── presentation/ # REST Routes, WS Handler
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── package.json
│   └── client/
│       ├── src/
│       │   ├── components/   # React-Komponenten
│       │   ├── engine/       # Client-seitige Engine
│       │   ├── hooks/        # Custom Hooks
│       │   ├── services/     # API + WS Services
│       │   ├── store/        # Zustand Store
│       │   ├── types/        # TypeScript-Definitionen
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── pnpm-workspace.yaml
├── turbo.json
└── .gitignore
```