// ─── BOT ENGINE ───────────────────────────────────
import { PrismaClient } from '@prisma/client';
import { BotPersonality, MarketPhase, PROPERTY_VALUE_MULTIPLIER, PROPERTY_RENDITES } from '../../domain/models/types.js';

const prisma = new PrismaClient();

interface BotDecisionWeights {
  buy: number;
  sell: number;
  loan: number;
  renovate: number;
  upgrade: number;
  bid: number;
  riskLevel: number; // 0-1
  loanUsage: { min: number; max: number };
}

const PERSONALITY_WEIGHTS: Record<BotPersonality, BotDecisionWeights> = {
  AGGRESSIVE_INVESTOR: { buy: 0.40, sell: 0.05, loan: 0.25, renovate: 0.10, upgrade: 0.05, bid: 0.15, riskLevel: 0.8, loanUsage: { min: 0.7, max: 0.9 } },
  SPECULATOR: { buy: 0.30, sell: 0.35, loan: 0.10, renovate: 0.10, upgrade: 0.05, bid: 0.10, riskLevel: 0.5, loanUsage: { min: 0.4, max: 0.6 } },
  DEFENSIVE_LANDLORD: { buy: 0.25, sell: 0.05, loan: 0.10, renovate: 0.25, upgrade: 0.20, bid: 0.05, riskLevel: 0.2, loanUsage: { min: 0.1, max: 0.3 } },
  LUXURY_DEVELOPER: { buy: 0.30, sell: 0.05, loan: 0.15, renovate: 0.15, upgrade: 0.25, bid: 0.10, riskLevel: 0.6, loanUsage: { min: 0.5, max: 0.7 } },
  BARGAIN_HUNTER: { buy: 0.35, sell: 0.15, loan: 0.10, renovate: 0.15, upgrade: 0.05, bid: 0.20, riskLevel: 0.4, loanUsage: { min: 0.3, max: 0.6 } },
  RISK_INVESTOR: { buy: 0.35, sell: 0.10, loan: 0.35, renovate: 0.05, upgrade: 0.05, bid: 0.10, riskLevel: 0.95, loanUsage: { min: 0.9, max: 1.0 } },
};

export async function runBotTurns(
  gameId: string,
  players: any[],
  properties: any[],
  districts: any[],
  marketPhase: MarketPhase
): Promise<void> {
  const bots = players.filter(p => p.type === 'BOT' && !p.isBankrupt);

  for (const bot of bots) {
    await runBotDecision(bot, gameId, players, properties, districts, marketPhase);
  }
}

async function runBotDecision(
  bot: any,
  gameId: string,
  players: any[],
  properties: any[],
  districts: any[],
  marketPhase: MarketPhase
): Promise<void> {
  const personality = bot.personality as BotPersonality;
  const weights = PERSONALITY_WEIGHTS[personality] || PERSONALITY_WEIGHTS.AGGRESSIVE_INVESTOR;

  // Bot has limited actions per turn (1-2)
  const actionCount = 1 + Math.floor(Math.random() * 2);

  for (let a = 0; a < actionCount; a++) {
    // Roll for action type
    const roll = Math.random();
    let cumulative = 0;

    if (roll < (cumulative += weights.buy)) {
      await tryBotBuy(bot, gameId, properties, districts, marketPhase, weights);
    } else if (roll < (cumulative += weights.sell)) {
      await tryBotSell(bot, gameId, properties, weights);
    } else if (roll < (cumulative += weights.loan)) {
      await tryBotLoan(bot, gameId, weights);
    } else if (roll < (cumulative += weights.renovate)) {
      await tryBotRenovate(bot, gameId, properties);
    } else if (roll < (cumulative += weights.upgrade)) {
      await tryBotUpgrade(bot, gameId, properties);
    } else {
      await tryBotBuy(bot, gameId, properties, districts, marketPhase, weights);
    }
  }
}

async function tryBotBuy(
  bot: any,
  gameId: string,
  properties: any[],
  districts: any[],
  marketPhase: MarketPhase,
  weights: BotDecisionWeights
): Promise<void> {
  // Find available properties
  const available = properties.filter(p => !p.playerId && p.forSale !== true);

  if (available.length === 0) return;

  // Score properties
  const scored = available.map(p => {
    const district = districts.find(d => d.id === p.districtId);
    if (!district) return { prop: p, score: 0 };

    // Luxury developer prefers high-prestige districts
    const prestigeScore = weights.riskLevel > 0.6 ? district.prestige * 2 : district.prestige;
    const demandScore = district.demand;
    const priceScore = p.marketValue < bot.capital * 0.3 ? 100 : 0;
    const crimePenalty = district.crime * (weights.riskLevel > 0.5 ? -0.5 : -1.5);

    // Bargain hunter scores cheap properties higher
    const bargainScore = district.baseLandPrice > p.marketValue * 1.2 ? 200 : 0;

    const score = prestigeScore + demandScore + priceScore + crimePenalty + bargainScore + Math.random() * 50;
    return { prop: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  if (best.prop.marketValue > bot.capital * 0.4) return; // Too expensive

  try {
    await buyPropertyRaw(gameId, bot.id, best.prop.id);
  } catch { /* bot fails, move on */ }
}

async function tryBotSell(bot: any, gameId: string, properties: any[], weights: BotDecisionWeights): Promise<void> {
  const owned = properties.filter(p => p.playerId === bot.id && p.type !== 'LAND');

  if (owned.length < 3) return;

  // Sell worst performing property
  const scored = owned.map(p => ({
    prop: p,
    score: p.rent - p.maintenance - (p.condition < 50 ? 100 : 0) + p.marketValue * 0.01,
  }));
  scored.sort((a, b) => a.score - b.score);

  const worst = scored[0];
  if (worst.prop.marketValue > 5000) {
    try {
      await sellPropertyRaw(gameId, bot.id, worst.prop.id);
    } catch { /* okay */ }
  }
}

async function tryBotLoan(bot: any, gameId: string, weights: BotDecisionWeights): Promise<void> {
  const loans = await prisma.loan.findMany({ where: { playerId: bot.id } });
  const totalLoans = loans.reduce((s, l) => s + l.remaining, 0);
  const loanTarget = bot.creditLimit * (weights.loanUsage.min + Math.random() * (weights.loanUsage.max - weights.loanUsage.min));

  if (totalLoans < loanTarget) {
    const amount = Math.min(loanTarget - totalLoans, 100000);
    if (amount > 1000) {
      try {
        await takeLoanRaw(gameId, bot.id, Math.round(amount));
      } catch { /* okay */ }
    }
  }
}

async function tryBotRenovate(bot: any, gameId: string, properties: any[]): Promise<void> {
  const owned = properties.filter(p => p.playerId === bot.id && p.condition < 70);
  if (owned.length === 0) return;

  const worst = owned.sort((a, b) => a.condition - b.condition)[0];
  const cost = worst.marketValue * 0.1 * ((100 - worst.condition) / 100);

  if (bot.capital > cost && cost < 20000) {
    try {
      await renovatePropertyRaw(gameId, bot.id, worst.id);
    } catch { /* okay */ }
  }
}

async function tryBotUpgrade(bot: any, gameId: string, properties: any[]): Promise<void> {
  const luxuryTypes = ['HOTEL', 'LUXURY_APARTMENT', 'SHOPPING_CENTER'];
  const upgradeable = properties.filter(
    p => p.playerId === bot.id && (luxuryTypes.includes(p.type) || p.marketValue > 50000) && p.upgradeLevel < 5
  );

  if (upgradeable.length === 0) return;

  const best = upgradeable.sort((a, b) => b.marketValue - a.marketValue)[0];
  const cost = best.marketValue * 0.15 * (best.upgradeLevel + 1);

  if (bot.capital > cost && cost < 50000) {
    try {
      await upgradePropertyRaw(gameId, bot.id, best.id);
    } catch { /* okay */ }
  }
}

// Raw database actions (bypass player validation for bots)
async function buyPropertyRaw(gameId: string, playerId: string, propertyId: string): Promise<void> {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!property || !player || property.playerId) return;

  const cost = property.marketValue * 1.035; // + tax
  if (player.capital < cost) return;

  await prisma.player.update({ where: { id: playerId }, data: { capital: { decrement: Math.round(cost) } } });
  await prisma.property.update({ where: { id: propertyId }, data: { playerId, purchasePrice: property.marketValue } });
}

async function sellPropertyRaw(gameId: string, playerId: string, propertyId: string): Promise<void> {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property || property.playerId !== playerId) return;

  const price = property.marketValue * 0.85;
  await prisma.player.update({ where: { id: playerId }, data: { capital: { increment: Math.round(price) } } });
  await prisma.property.update({ where: { id: propertyId }, data: { playerId: null, ownedSince: 0 } });
}

async function renovatePropertyRaw(gameId: string, playerId: string, propertyId: string): Promise<void> {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!property || !player) return;

  const cost = property.marketValue * 0.1 * ((100 - property.condition) / 100);
  if (player.capital < cost) return;

  await prisma.player.update({ where: { id: playerId }, data: { capital: { decrement: Math.round(cost) } } });
  await prisma.property.update({ where: { id: propertyId }, data: { condition: 100 } });
}

async function upgradePropertyRaw(gameId: string, playerId: string, propertyId: string): Promise<void> {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!property || !player) return;

  const cost = property.marketValue * 0.15 * (property.upgradeLevel + 1);
  if (player.capital < cost) return;

  await prisma.player.update({ where: { id: playerId }, data: { capital: { decrement: Math.round(cost) } } });
  await prisma.property.update({ where: { id: propertyId }, data: { upgradeLevel: { increment: 1 }, prestige: Math.min(100, property.prestige + 8) } });
}

async function takeLoanRaw(gameId: string, playerId: string, amount: number): Promise<void> {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player) return;

  const totalLoans = (await prisma.loan.findMany({ where: { playerId } }))
    .reduce((s, l) => s + l.remaining, 0);
  if (totalLoans + amount > player.creditLimit) return;

  const interestRate = totalLoans > player.creditLimit * 0.8 ? 0.015 : 0.010;

  await prisma.player.update({ where: { id: playerId }, data: { capital: { increment: amount } } });
  await prisma.loan.create({
    data: { id: crypto.randomUUID(), playerId, gameId, amount, interestRate, remaining: amount, takenAt: 0, duration: 20 },
  });
}