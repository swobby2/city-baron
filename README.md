# City Baron — Immobilien-Tycoon Browsergame

Ein OpenFront-inspiriertes Immobilien-Strategiespiel für den Browser.

## Quick Start (Lokal)

```bash
npm install
cd packages/server && npx prisma generate && npx prisma migrate dev --name init
cd ../..
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Deployment

### Auf Zeabur (empfohlen — einfach & kostenlos)

1. Forke dieses Repo auf GitHub
2. Gehe zu [zeabur.com](https://zeabur.com) → New Project → Connect GitHub Repo
3. Wähle `city-baron` → Zeabur erkennt automatisch Node.js
4. Füge PostgreSQL hinzu (Zeabur Dashboard → Add Database → PostgreSQL)
5. Setze Environment Variable: `DATABASE_URL` = PostgreSQL Connection String von Zeabur
6. Setze `NODE_ENV=production`, `PORT=3001`
7. Deploy — fertig!

### Auf Fly.io

```bash
fly launch
fly scale vm shared-cpu-1x@256mb  # Free tier
fly secrets set DATABASE_URL="<postgres-url>"
fly deploy
```

### Auf Railway

1. Verbinde GitHub Repo mit Railway
2. Füge PostgreSQL Plugin hinzu
3. Setze `DATABASE_URL` Environment Variable
4. Deploy

## Technik

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + Socket.io
- **Datenbank:** PostgreSQL (Prisma ORM)
- **Deployment:** Containerized (Docker)