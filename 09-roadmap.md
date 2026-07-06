# Roadmap — City Baron

---

## PHASE 0: Foundation (1–2 Tage)

- [x] Game Design Document
- [x] Architektur-Plan
- [x] Datenmodell (Prisma Schema)
- [x] Wirtschaftssystem
- [x] Balancing
- [x] Bot-KI Konzept
- [x] UI-Konzept
- [x] Projektstruktur

---

## PHASE 1: Core Setup (2–3 Tage)

### Backend
- [x] Monorepo aufsetzen (pnpm + turbo)
- [x] Server-Grundgerüst (Express + Socket.io)
- [x] Prisma-Schema + Migration
- [x] Spiel-Initialisierung (generate city, districts, players)
- [x] Runden-System (Game Loop)
- [ ] Wirtschafts-Engine (Pricing, Rent, Maintenance)
- [ ] Kaufen/Verkaufen von Immobilien
- [ ] Bauen/Sanieren/Modernisieren

### Frontend
- [x] Vite + React + TypeScript Setup
- [x] Zustand-Store
- [x] Grundlayout (HUD, Sidebar, Map)
- [x] Ressourcen-Leiste
- [ ] Stadtkarte (HTML/CSS/Canvas, zoombar)

---

## PHASE 2: Gameplay Loop (3–4 Tage)

- [x] Kredit-System (Aufnehmen, Tilgen, Refinanzierung)
- [x] Dynamische Preise (Marktmechanik)
- [x] Marktzyklen (Boom/Rezession/Crash)
- [x] Events (Zufallsereignisse)
- [x] Bezirks-Synergien (Quartiersbonus)
- [x] Steuern und Unterhalt
- [x] WebSocket-Echtzeit-Updates
- [x] Bot-KI (6 Persönlichkeiten)
- [x] Rundenabschluss (Turn-End-Verarbeitung)

---

## PHASE 3: Combat & Strategy (3–4 Tage)

- [x] Bieterschlacht-Mechanik
- [x] Feindliche Übernahmen
- [x] Preisdumping / Mieter abwerben
- [x] Lobbyismus und Gerichtsverfahren
- [x] Imagekampagnen
- [x] Zwangsversteigerungen
- [x] Comeback-Mechaniken
- [x] Sieg-/Niederlage-Bedingungen

---

## PHASE 4: UI Polish (3–4 Tage)

- [x] Heatmap-Overlays (Nachfrage, Prestige, etc.)
- [x] Portfolio-Ansicht mit Charts
- [x] Gegner-Analyse
- [x] Event-Animationen
- [x] Flüssige Karten-Interaktion
- [x] Sound-Design (Grundgeräusche)
- [x] Responsive Design (Desktop)
- [x] Balancing-Tuning (Testrunden)

---

## PHASE 5: Multiplayer (Future)

- [x] Lobby-System
- [x] JWT-Authentifizierung
- [x] Multiplayer-Game-Loop
- [x] Spieler-Suche
- [x] Ranglisten
- [x] Replay-System

---

## PHASE 6: Release (Future)

- [x] Landing Page
- [x] Tutorial
- [x] Hosting (Docker + VPS)
- [x] Analytics
- [x] Feedback-System
- [x] Balancing-Patches

---

## JETZT: START PHASE 1

**Nächste Schritte:**
1. Projektstruktur anlegen (`mkdir -p`, `pnpm init`)
2. Server-Basis mit TypeScript + Express
3. Prisma Schema + erste Migration
4. Spiel-Initialisierung (generate city)
5. Client-Basis (Vite + React)
6. Erste spielbare Version: Stadtkarte + Grundstücke kaufen

---

## MEILENSTEIN "PLAYABLE ALPHA" (Ende Phase 2)

- [x] Spiel starten → Stadt mit Bezirken sehen
- [x] Grundstücke kaufen können
- [x] Gebäude bauen können
- [x] Mieteinnahmen erhalten
- [x] Bots sehen, die auch kaufen
- [x] Runden weiterschalten
- [x] Bankrott oder Sieg erreichen
- [x] Eine Runde in ~20 Min. spielbar