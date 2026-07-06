// ─── SERVER: MAIN ENTRY ───────────────────────────
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { createNewGame, getGameState } from './application/game/game-init.js';
import { processTurn } from './application/game/turn-service.js';
import {
  buyProperty, sellProperty, renovateProperty,
  upgradeProperty, takeLoan
} from './application/player/actions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Serve static files in production
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDist));

// ─── REST API ───────────────────────────────────

// Create new game
app.post('/api/game/new', async (req, res) => {
  try {
    const { playerName = 'Spieler', botCount = 3 } = req.body;
    const gameId = await createNewGame(playerName, botCount);
    const state = await getGameState(gameId);
    res.json({ gameId, state });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Get game state
app.get('/api/game/:id', async (req, res) => {
  try {
    const state = await getGameState(req.params.id);
    if (!state) return res.status(404).json({ error: 'Game not found' });

    // Get properties and loans for full state
    const properties = await prisma.property.findMany({ where: { gameId: req.params.id } });
    const loans = await prisma.loan.findMany({ where: { gameId: req.params.id } });

    res.json({ ...state, properties, loans });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Execute turn
app.post('/api/game/:id/turn', async (req, res) => {
  try {
    const result = await processTurn(req.params.id);
    if (!result) return res.status(404).json({ error: 'Game not found' });

    const properties = await prisma.property.findMany({ where: { gameId: req.params.id } });
    const loans = await prisma.loan.findMany({ where: { gameId: req.params.id } });

    const fullState = { ...result, properties, loans };
    res.json(fullState);

    // Broadcast to all connected clients
    io.to(req.params.id).emit('gameUpdate', fullState);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Player actions
app.post('/api/game/:id/buy', async (req, res) => {
  try {
    const { playerId, propertyId } = req.body;
    const result = await buyProperty(req.params.id, playerId, propertyId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/game/:id/sell', async (req, res) => {
  try {
    const { playerId, propertyId } = req.body;
    const result = await sellProperty(req.params.id, playerId, propertyId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/game/:id/renovate', async (req, res) => {
  try {
    const { playerId, propertyId } = req.body;
    const result = await renovateProperty(req.params.id, playerId, propertyId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/game/:id/upgrade', async (req, res) => {
  try {
    const { playerId, propertyId } = req.body;
    const result = await upgradeProperty(req.params.id, playerId, propertyId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/game/:id/loan', async (req, res) => {
  try {
    const { playerId, amount } = req.body;
    const result = await takeLoan(req.params.id, playerId, amount);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ─── LOBBY SYSTEM ───────────────────────────────

// Get lobby info — all active games (rooms)
app.get('/api/lobby', async (_req, res) => {
  try {
    const games = await prisma.game.findMany({
      where: { state: { not: 'FINISHED' } },
      include: {
        players: { select: { id: true, name: true, type: true, marketShare: true, capital: true } },
        _count: { select: { players: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const rooms = games.map(g => ({
      id: g.id,
      name: `Raum ${g.id.slice(0, 4)}`,
      players: g.players.length,
      playerList: g.players.map(p => ({ name: p.name, type: p.type, marketShare: p.marketShare })),
      turn: g.turn,
      phase: g.marketPhase,
      state: g.state,
      createdAt: g.createdAt,
    }));

    res.json({ rooms });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new game (from lobby)
app.post('/api/lobby/create', async (req, res) => {
  try {
    const { playerName = 'Spieler', botCount = 3 } = req.body;
    const gameId = await createNewGame(playerName, botCount);
    const state = await getGameState(gameId);
    res.json({ gameId, state });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─── WEB SOCKET ──────────────────────────────────

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinGame', (gameId: string) => {
    socket.join(gameId);
    console.log(`Socket ${socket.id} joined game ${gameId}`);
  });

  socket.on('leaveGame', (gameId: string) => {
    socket.leave(gameId);
  });
});

// ─── SPA catch-all (must be last) ───────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ─── START ───────────────────────────────────────

const PORT = Number(process.env.PORT) || 3001;
server.listen(PORT, () => {
  console.log(`🏙️  City Baron Server läuft auf Port ${PORT}`);
});