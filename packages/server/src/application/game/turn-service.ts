// ─── APPLICATION: TURN SERVICE ─────────────────────
import { PrismaClient } from '@prisma/client';
import {
  calculateLandPrice, calculateMarketValue, calculateRent,
  calculateMaintenance, calculateOccupancy, calculateCreditRating,
  calculateLoanLimit, getInterestRate, calculateTaxes,
  calculateMarketPhaseDuration, getRenovationCost, getUpgradeCost
} from '../../domain/economy/engine.js';
import { MarketPhase, SYNERGY_BONUSES, MARKET_CYCLES } from '../../domain/models/types.js';
import { runBotTurns } from '../bot/bot-engine.js';

const prisma = new PrismaClient();

export async function processTurn(gameId: string): Promise<any> {
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) return null;

  const districts = await prisma.district.findMany({ where: { gameId } });
  const players = await prisma.player.findMany({ where: { gameId } });
  const properties = await prisma.property.findMany({ where: { gameId } });
  const loans = await prisma.loan.findMany({ where: { gameId } });

  const turn = game.turn + 1;
  const marketPhase = game.marketPhase as MarketPhase;

  // ─── 1. Process loans (interest) ───
  for (const loan of loans) {
    const interestPayment = loan.remaining * loan.interestRate;
    await prisma.player.update({
      where: { id: loan.playerId },
      data: { capital: { decrement: interestPayment } },
    });
    await prisma.loan.update({
      where: { id: loan.id },
      data: { remaining: { decrement: loan.amount / loan.duration } },
    });
  }

  // ─── 2. Calculate income & expenses per player ───
  for (const player of players) {
    if (player.isBankrupt) continue;

    const playerProps = properties.filter(p => p.playerId === player.id);
    let totalIncome = 0;
    let totalMaintenance = 0;
    let totalMarketValue = 0;

    // Calculate synergy bonuses per district
    const districtGroups = new Map<string, typeof playerProps>();
    for (const prop of playerProps) {
      const existing = districtGroups.get(prop.districtId) || [];
      existing.push(prop);
      districtGroups.set(prop.districtId, existing);
    }

    for (const [districtId, props] of districtGroups) {
      const district = districts.find(d => d.id === districtId);
      if (!district) continue;

      const ownedCount = props.length;
      let synergyRentBonus = 0;
      let synergyPrestigeBonus = 0;

      for (const bonus of SYNERGY_BONUSES) {
        if (ownedCount >= bonus.minOwned) {
          synergyRentBonus = Math.max(synergyRentBonus, bonus.rentBonus);
          synergyPrestigeBonus = Math.max(synergyPrestigeBonus, bonus.prestigeBonus);
        }
      }

      const landPrice = calculateLandPrice(district, marketPhase);

      for (const prop of props) {
        const occupancy = calculateOccupancy(
          district.demand + (marketPhase === 'HOUSING_SHORTAGE' ? 40 : 0),
          district.crime,
          prop.prestige + synergyPrestigeBonus,
          prop.rent,
          district.rentLevel * 100
        );
        const marketValue = calculateMarketValue(landPrice, prop.type as any, prop.condition, prop.upgradeLevel, synergyRentBonus);
        const rent = calculateRent(marketValue, prop.type as any, occupancy, synergyRentBonus);
        const maintenance = calculateMaintenance(prop.purchasePrice, prop.type as any, prop.condition);
        const conditionDecay = Math.max(0.5, 2 - (prop.condition / 100)) * (district.crime > 70 ? 1.2 : 1);
        const newCondition = Math.max(0, prop.condition - conditionDecay);

        totalIncome += rent;
        totalMaintenance += maintenance;
        totalMarketValue += marketValue;

        await prisma.property.update({
          where: { id: prop.id },
          data: {
            marketValue,
            rent,
            occupancy: Math.round(occupancy),
            condition: Math.round(newCondition),
          },
        });
      }
    }

    // Taxes
    const taxes = calculateTaxes(totalMarketValue, totalIncome);
    // Loan payments
    const playerLoans = loans.filter(l => l.playerId === player.id);
    const loanPayment = playerLoans.reduce((sum, l) => sum + (l.remaining * l.interestRate + l.amount / l.duration), 0);

    const cashflow = totalIncome - totalMaintenance - taxes - loanPayment;

    // Update player
    const newCapital = player.capital + cashflow;
    const allProperties = await prisma.property.findMany({ where: { gameId } });
    const totalMarket = allProperties.reduce((s, p) => s + p.marketValue, 0);
    const newMarketShare = totalMarket > 0 ? (totalMarketValue / totalMarket) * 100 : 0;
    const avgCapital = players.reduce((s, p) => s + p.capital, 0) / players.length;
    const portfolioDiversity = new Set(playerProps.map(p => p.type)).size / 5;

    const creditRating = calculateCreditRating(
      totalMarketValue + newCapital,
      avgCapital,
      player.image,
      cashflow,
      portfolioDiversity
    );
    const newLoanLimit = calculateLoanLimit(totalMarketValue + newCapital, creditRating);

    // Check bankruptcy
    let isBankrupt = player.isBankrupt;
    let bankruptcyProtection = player.bankruptcyProtection;
    if (newCapital < 0 && newCapital + newLoanLimit - player.totalLoan < -5000) {
      bankruptcyProtection--;
      if (bankruptcyProtection <= 0) {
        isBankrupt = true;
      }
    }

    await prisma.player.update({
      where: { id: player.id },
      data: {
        capital: newCapital,
        cashflow,
        marketShare: newMarketShare,
        creditLimit: newLoanLimit,
        isBankrupt,
        bankruptcyProtection: Math.max(0, bankruptcyProtection),
      },
    });
  }

  // ─── 3. Run bot decisions ───
  const updatedPlayers = await prisma.player.findMany({ where: { gameId } });
  const updatedProperties = await prisma.property.findMany({ where: { gameId } });
  await runBotTurns(gameId, updatedPlayers, updatedProperties, districts, marketPhase);

  // ─── 4. Market cycle update ───
  let newPhase: MarketPhase = marketPhase;
  const activeEvents = await prisma.gameEvent.findMany({
    where: { gameId, remaining: { gt: 0 } },
  });

  // Check if events force a market phase
  const boomEvent = activeEvents.find(e => e.type === 'BOOM');
  const crashEvent = activeEvents.find(e => e.type === 'CRASH');

  if (boomEvent) newPhase = 'BOOM';
  else if (crashEvent) newPhase = 'CRASH';
  else if (marketPhase === 'CRASH' || marketPhase === 'BOOM') {
    // These are event-driven, return to normal after event ends
    const hadEvent = activeEvents.some(e => e.type === 'BOOM' || e.type === 'CRASH');
    if (!hadEvent) newPhase = 'NORMAL';
  }

  // Random phase transition (10% chance each turn)
  if (newPhase === 'NORMAL' && Math.random() < 0.1) {
    newPhase = Math.random() < 0.5 ? 'RECESSION' : 'BOOM';
  } else if (newPhase === 'RECESSION' && Math.random() < 0.15) {
    newPhase = Math.random() < 0.3 ? 'CRASH' : 'NORMAL';
  }

  // ─── 5. Process events ───
  for (const event of activeEvents) {
    await prisma.gameEvent.update({
      where: { id: event.id },
      data: { remaining: { decrement: 1 } },
    });
  }

  // Random events (25% chance)
  if (Math.random() < 0.25) {
    await generateRandomEvent(gameId);
  }

  // ─── 6. Update district dynamics ───
  for (const district of districts) {
    const districtProps = updatedProperties.filter(p => p.districtId === district.id);
    const ownedCount = districtProps.filter(p => p.playerId !== null).length;

    // Districts evolve
    const demandChange = (district.growth) + (district.prestige > 70 ? 2 : 0) - (district.crime > 70 ? 3 : 0);
    const prestigeChange = (ownedCount > 5 ? 1 : -1) + (Math.random() < 0.2 ? (Math.random() < 0.5 ? 2 : -2) : 0);
    const crimeChange = (district.prestige > 60 ? -1 : 1) + (ownedCount > 10 ? -2 : 0);
    const trafficChange = ownedCount > 5 ? 1 : -1;

    await prisma.district.update({
      where: { id: district.id },
      data: {
        demand: Math.max(0, Math.min(100, district.demand + demandChange)),
        prestige: Math.max(0, Math.min(100, district.prestige + prestigeChange)),
        crime: Math.max(0, Math.min(100, district.crime + crimeChange)),
        traffic: Math.max(0, Math.min(100, district.traffic + trafficChange)),
      },
    });
  }

  // ─── 7. Check win conditions ───
  const finalPlayers = await prisma.player.findMany({ where: { gameId } });
  let winner: string | null = null;

  // Check market share dominance
  for (const p of finalPlayers) {
    if (p.marketShare >= 80) winner = p.name;
  }

  // Check if only one non-bankrupt player remains
  const alivePlayers = finalPlayers.filter(p => !p.isBankrupt);
  if (alivePlayers.length <= 1 && finalPlayers.length > 1) {
    winner = alivePlayers[0]?.name || null;
  }

  // ─── 8. Update game ───
  await prisma.game.update({
    where: { id: gameId },
    data: {
      turn,
      marketPhase: newPhase,
      state: winner ? 'FINISHED' : 'RUNNING',
    },
  });

  // ─── 9. Log ───
  await prisma.actionLog.create({
    data: {
      id: crypto.randomUUID(),
      gameId,
      turn,
      action: 'TURN_END',
      details: JSON.stringify({ phase: newPhase, winner }),
    },
  });

  // Return fresh state
  return await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      districts: { orderBy: { districtIndex: 'asc' } },
      players: { orderBy: { marketShare: 'desc' } },
      events: true,
    },
  });
}

async function generateRandomEvent(gameId: string) {
  const events = [
    { type: 'SUBSIDIES', name: '🔧 Förderungen', duration: 2, effect: { maintenanceReduction: 0.3 } },
    { type: 'TAX_CHANGE', name: '📉 Steuersenkung', duration: 3, effect: { taxReduction: 0.1 } },
    { type: 'HOUSING_SHORTAGE', name: '🏠 Wohnungsnot', duration: 3, effect: { demandBonus: 40 } },
    { type: 'SCANDAL', name: '📰 Skandal', duration: 2, effect: { imageLoss: 20 } },
    { type: 'CRIME_WAVE', name: '🚔 Kriminalitätsanstieg', duration: 2, effect: { crimeIncrease: 20 } },
    { type: 'FIRE', name: '🔥 Großbrand', duration: 1, effect: { conditionDamage: 80 } },
  ];

  const event = events[Math.floor(Math.random() * events.length)];

  const districts = await prisma.district.findMany({ where: { gameId } });
  const targetDistrict = districts[Math.floor(Math.random() * districts.length)];

  await prisma.gameEvent.create({
    data: {
      id: crypto.randomUUID(),
      gameId,
      name: event.name,
      type: event.type,
      targetDistrictId: targetDistrict.id,
      duration: event.duration,
      remaining: event.duration,
      params: JSON.stringify(event.effect),
    },
  });
}