// ─── APPLICATION: PLAYER ACTIONS ───────────────────
import { PrismaClient } from '@prisma/client';
import {
  calculateLandPrice, calculateMarketValue, calculateMaintenance,
  getRenovationCost, getUpgradeCost, getPurchaseTax
} from '../../domain/economy/engine.js';
import { PropertyType, SYNERGY_BONUSES } from '../../domain/models/types.js';

const prisma = new PrismaClient();

export async function buyProperty(gameId: string, playerId: string, propertyId: string): Promise<{ success: boolean; message: string }> {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  const game = await prisma.game.findUnique({ where: { id: gameId } });

  if (!property || !player || !game) return { success: false, message: 'Nicht gefunden' };
  if (property.playerId) return { success: false, message: 'Bereits besetzt' };
  if (property.playerId === playerId) return { success: false, message: 'Gehört bereits dir' };

  const purchasePrice = property.marketValue;
  const tax = getPurchaseTax(purchasePrice);
  const totalCost = purchasePrice + tax;

  if (player.capital < totalCost) return { success: false, message: `Nicht genug Kapital. Brauchst ${Math.round(totalCost)} €, hast ${Math.round(player.capital)} €` };

  // Check if player has enough credit
  const totalLoan = (await prisma.loan.findMany({ where: { playerId } }))
    .reduce((s, l) => s + l.remaining, 0);
  if (totalCost > player.capital + (player.creditLimit - totalLoan)) {
    return { success: false, message: 'Kreditlimit erreicht' };
  }

  await prisma.$transaction([
    prisma.player.update({ where: { id: playerId }, data: { capital: { decrement: totalCost } } }),
    prisma.property.update({
      where: { id: propertyId },
      data: {
        playerId,
        purchasePrice,
        ownedSince: game.turn,
      },
    }),
    prisma.actionLog.create({
      data: {
        id: crypto.randomUUID(),
        gameId,
        playerId,
        turn: game.turn,
        action: 'BUY',
        details: JSON.stringify({ propertyId, price: purchasePrice, tax }),
      },
    }),
  ]);

  return { success: true, message: `Gekauft für ${Math.round(purchasePrice)} € (zzgl. ${Math.round(tax)} € Steuer)` };
}

export async function sellProperty(gameId: string, playerId: string, propertyId: string): Promise<{ success: boolean; message: string }> {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  const game = await prisma.game.findUnique({ where: { id: gameId } });

  if (!property || !player || !game) return { success: false, message: 'Nicht gefunden' };
  if (property.playerId !== playerId) return { success: false, message: 'Gehört dir nicht' };

  const sellPrice = property.marketValue * 0.85; // 15% Verkaufsgebühr/Verlust

  await prisma.$transaction([
    prisma.player.update({ where: { id: playerId }, data: { capital: { increment: sellPrice } } }),
    prisma.property.update({
      where: { id: propertyId },
      data: { playerId: null, ownedSince: 0, forSale: false, salePrice: null },
    }),
    prisma.actionLog.create({
      data: {
        id: crypto.randomUUID(),
        gameId,
        playerId,
        turn: game.turn,
        action: 'SELL',
        details: JSON.stringify({ propertyId, price: sellPrice }),
      },
    }),
  ]);

  return { success: true, message: `Verkauft für ${Math.round(sellPrice)} €` };
}

export async function renovateProperty(gameId: string, playerId: string, propertyId: string): Promise<{ success: boolean; message: string }> {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  const game = await prisma.game.findUnique({ where: { id: gameId } });

  if (!property || !player || !game) return { success: false, message: 'Nicht gefunden' };
  if (property.playerId !== playerId) return { success: false, message: 'Gehört dir nicht' };
  if (property.condition >= 100) return { success: false, message: 'Bereits in Top-Zustand' };

  const cost = getRenovationCost(property.marketValue, property.condition);
  if (player.capital < cost) return { success: false, message: `Nicht genug Kapital. Brauchst ${Math.round(cost)} €` };

  await prisma.$transaction([
    prisma.player.update({ where: { id: playerId }, data: { capital: { decrement: cost } } }),
    prisma.property.update({ where: { id: propertyId }, data: { condition: 100 } }),
    prisma.actionLog.create({
      data: {
        id: crypto.randomUUID(),
        gameId,
        playerId,
        turn: game.turn,
        action: 'RENOVATE',
        details: JSON.stringify({ propertyId, cost }),
      },
    }),
  ]);

  return { success: true, message: `Saniert für ${Math.round(cost)} €` };
}

export async function upgradeProperty(gameId: string, playerId: string, propertyId: string): Promise<{ success: boolean; message: string }> {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  const game = await prisma.game.findUnique({ where: { id: gameId } });

  if (!property || !player || !game) return { success: false, message: 'Nicht gefunden' };
  if (property.playerId !== playerId) return { success: false, message: 'Gehört dir nicht' };

  const cost = getUpgradeCost(property.marketValue, property.upgradeLevel);
  if (player.capital < cost) return { success: false, message: `Nicht genug Kapital. Brauchst ${Math.round(cost)} €` };

  const newPrestige = Math.min(100, property.prestige + 8);

  await prisma.$transaction([
    prisma.player.update({ where: { id: playerId }, data: { capital: { decrement: cost } } }),
    prisma.property.update({
      where: { id: propertyId },
      data: { upgradeLevel: { increment: 1 }, prestige: newPrestige },
    }),
    prisma.actionLog.create({
      data: {
        id: crypto.randomUUID(),
        gameId,
        playerId,
        turn: game.turn,
        action: 'UPGRADE',
        details: JSON.stringify({ propertyId, cost }),
      },
    }),
  ]);

  return { success: true, message: `Modernisiert auf Level ${property.upgradeLevel + 1} für ${Math.round(cost)} €` };
}

export async function takeLoan(gameId: string, playerId: string, amount: number): Promise<{ success: boolean; message: string }> {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!player || !game) return { success: false, message: 'Nicht gefunden' };

  const totalLoans = (await prisma.loan.findMany({ where: { playerId } }))
    .reduce((s, l) => s + l.remaining, 0);

  if (totalLoans + amount > player.creditLimit) {
    return { success: false, message: `Kreditlimit (${Math.round(player.creditLimit)} €) erreicht` };
  }

  const interestRate = getInterestRateForPlayer(player);

  await prisma.$transaction([
    prisma.player.update({ where: { id: playerId }, data: { capital: { increment: amount } } }),
    prisma.loan.create({
      data: {
        id: crypto.randomUUID(),
        playerId,
        gameId,
        amount,
        interestRate,
        remaining: amount,
        takenAt: game.turn,
        duration: 20,
      },
    }),
  ]);

  return { success: true, message: `${Math.round(amount)} € Kredit aufgenommen (${(interestRate * 100).toFixed(1)} % Zins/Runde)` };
}

function getInterestRateForPlayer(player: any): number {
  if (player.totalLoan > player.creditLimit * 0.8) return 0.015;
  if (player.totalLoan > player.creditLimit * 0.5) return 0.010;
  return 0.0067;
}