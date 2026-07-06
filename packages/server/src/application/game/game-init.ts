// ─── APPLICATION: GAME INIT ─────────────────────────
import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { BotPersonality, DISTRICT_NAMES, BOT_NAMES } from '../../domain/models/types.js';

const prisma = new PrismaClient();

const BOT_CONFIGS: { name: string; personality: BotPersonality }[] = [
  { name: 'Maximus Invest', personality: 'AGGRESSIVE_INVESTOR' },
  { name: 'Spekulant Schmitz', personality: 'SPECULATOR' },
  { name: 'Günther Gemütlich', personality: 'DEFENSIVE_LANDLORD' },
  { name: 'Baroness von Lux', personality: 'LUXURY_DEVELOPER' },
  { name: 'Schnäppchen-Susi', personality: 'BARGAIN_HUNTER' },
  { name: 'Risiko-Rudi', personality: 'RISK_INVESTOR' },
];

export async function createNewGame(playerName: string, botCount: number = 3) {
  const gameId = uuid();
  const activeBots = BOT_CONFIGS.slice(0, Math.min(botCount, 6));

  // Create game
  await prisma.game.create({
    data: { id: gameId },
  });

  // Create districts
  const districtCount = 10 + Math.floor(Math.random() * 5);
  const shuffledNames = DISTRICT_NAMES.sort(() => Math.random() - 0.5).slice(0, districtCount);

  for (let i = 0; i < shuffledNames.length; i++) {
    await prisma.district.create({
      data: {
        id: uuid(),
        gameId,
        name: shuffledNames[i],
        districtIndex: i,
        demand: 30 + Math.floor(Math.random() * 50),
        prestige: 30 + Math.floor(Math.random() * 50),
        crime: 10 + Math.floor(Math.random() * 40),
        traffic: 20 + Math.floor(Math.random() * 60),
        growth: -2 + Math.floor(Math.random() * 6),
        rentLevel: 3 + Math.floor(Math.random() * 5),
        baseLandPrice: 5000 + Math.floor(Math.random() * 15000),
        maxPlots: 10 + Math.floor(Math.random() * 8),
      },
    });
  }

  // Create properties (unowned) for each district
  const districts = await prisma.district.findMany({ where: { gameId } });
  for (const district of districts) {
    const types = ['LAND', 'APARTMENT', 'RENOVATION_OBJECT', 'WAREHOUSE', 'LAND', 'LAND'];
    for (let i = 0; i < district.maxPlots; i++) {
      const type = types[i % types.length];
      const landPrice = district.baseLandPrice * (1 + (district.demand - district.crime) / 100) * (district.prestige / 50);
      await prisma.property.create({
        data: {
          id: uuid(),
          gameId,
          districtId: district.id,
          type,
          plotIndex: i,
          marketValue: landPrice * (0.5 + Math.random()),
          condition: 40 + Math.floor(Math.random() * 60),
          prestige: 30 + Math.floor(Math.random() * 40),
          purchasePrice: landPrice,
        },
      });
    }
  }

  // Create human player
  await prisma.player.create({
    data: {
      id: uuid(),
      gameId,
      name: playerName,
      type: 'HUMAN',
      capital: 100000,
      creditLimit: 50000,
    },
  });

  // Create bot players
  for (const bot of activeBots) {
    await prisma.player.create({
      data: {
        id: uuid(),
        gameId,
        name: bot.name,
        type: 'BOT',
        personality: bot.personality,
        capital: 100000,
        creditLimit: 50000,
        influence: 10,
        image: 50,
      },
    });
  }

  return gameId;
}

export async function getGameState(gameId: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      districts: { orderBy: { districtIndex: 'asc' } },
      players: { orderBy: { marketShare: 'desc' } },
      events: true,
    },
  });

  if (!game) return null;

  const properties = await prisma.property.findMany({ where: { gameId } });
  const loans = await prisma.loan.findMany({ where: { gameId } });

  return {
    ...game,
    properties,
    loans,
  };
}