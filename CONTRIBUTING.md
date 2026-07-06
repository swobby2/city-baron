# Contributing to City Baron 🏙️

## Quick Start

1. **Fork** the repo on GitHub
2. **Clone** your fork
3. **Create a branch:** `git checkout -b feature/my-idea`
4. **Make changes** and commit
5. **Push** to your fork
6. **Open a Pull Request**

## Development Setup

```bash
npm install
cd packages/server && npx prisma generate && npx prisma migrate dev --name init
cd ../..
npm run dev
```

## What to work on

- Bot AI improvements
- UI polish and animations
- Multiplayer support
- New building types
- Economic balancing
- Sound effects
- Mobile responsive design

## Code Style

- TypeScript only
- Clean, modular architecture
- Each game mechanic in its own file
- React components in `packages/client/src/components/`
- Server logic in `packages/server/src/domain/` or `application/`

## Questions?

Open an issue on GitHub!