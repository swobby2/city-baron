# City Baron 🏙️

**Ein OpenFront-inspiriertes Immobilien-Strategiespiel für den Browser.**

Baue einen Immobilienkonzern auf, kaufe Grundstücke, saniere und modernisiere Gebäude, kämpfe gegen KI-Konkurrenten und werde zum Marktführer!

👉 **[Jetzt online spielen!](https://city-baron.onrender.com)** (wenn deployed)

---

## Features

- 🗺️ **Dynamische Stadtkarte** mit 10+ Bezirken und Heatmaps
- 🏪 **Marktsystem** mit Angebot/Nachfrage und Preisschwankungen
- 🏦 **Bank- und Kreditsystem** mit Bonitätsbewertung
- 🤖 **6 Bot-Persönlichkeiten** mit eigener KI
- 📊 **Wirtschafts-Simulation** mit Marktzyklen, Events und Synergien
- 🎮 **Lobby-System** mit mehreren Spielräumen
- 🔧 **Sanieren, Modernisieren, Handeln** — viele Strategien

---

## Für Entwickler

### Schnellstart lokal

```bash
# Repository klonen
git clone https://github.com/swobby2/city-baron.git
cd city-baron

# Abhängigkeiten installieren
npm install

# Prisma Client generieren
cd packages/server
npx prisma generate
npx prisma migrate dev --name init
cd ../..

# Entwicklung starten (Server + Client gleichzeitig)
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

### Tech Stack

| Komponente | Technologie |
|------------|-------------|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Node.js + Express + Socket.io |
| Datenbank | PostgreSQL (Prisma ORM) |
| Echtzeit | WebSocket (Socket.io) |

---

## Mitwirken (Contributing)

Jeder kann mitmachen! So geht's:

1. **Fork** das Repository (oben rechts auf GitHub)
2. **Clone** deinen Fork: `git clone https://github.com/DEIN-USERNAME/city-baron.git`
3. **Branch** erstellen: `git checkout -b feature/meine-idee`
4. **Änderungen** machen und committen
5. **Push** zu deinem Fork: `git push origin feature/meine-idee`
6. **Pull Request** auf GitHub erstellen

### Was kannst du beitragen?

- 🐛 **Bugs melden** → [Issues](https://github.com/swobby2/city-baron/issues)
- 💡 **Feature-Ideen** → Diskussion in Issues
- 🎨 **UI/UX Verbesserungen** → CSS, Animationen, Layout
- 🧠 **Bot-KI** → Klügere Gegner
- ⚖️ **Balancing** → Wirtschaftssystem optimieren
- 🌍 **Multiplayer** → Echtzeit-Mehrspieler-Modus
- 📖 **Dokumentation** → Bessere README, Wiki

### Code-Richtlinien

- **TypeScript** verwenden (kein JavaScript)
- **Saubere, kommentierte Module** — jeder Bereich hat seine eigene Datei
- Neue Mechaniken in `packages/server/src/domain/` oder `application/`
- UI-Komponenten in `packages/client/src/components/`

---

## Lizenz

MIT License — siehe [LICENSE](LICENSE)

---

*Built with ❤️ by Marcel Swoboda*