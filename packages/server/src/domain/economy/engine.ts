// ─── DOMAIN: ECONOMY ENGINE ────────────────────────
import { DistrictData, PropertyData, PropertyType, MarketPhase, PROPERTY_RENDITES, PROPERTY_MAINTENANCE, PROPERTY_VALUE_MULTIPLIER, MARKET_CYCLES } from '../models/types.js';

export function calculateLandPrice(district: DistrictData, marketPhase: MarketPhase): number {
  const cycle = MARKET_CYCLES[marketPhase];
  return district.baseLandPrice *
    (1 + (district.demand - district.crime) / 100) *
    (district.prestige / 50) *
    (1 + (district.traffic - 50) / 100) *
    cycle.priceMultiplier;
}

export function calculateMarketValue(
  landPrice: number,
  type: PropertyType,
  condition: number,
  upgradeLevel: number,
  synergyRentBonus: number
): number {
  const multiplier = PROPERTY_VALUE_MULTIPLIER[type];
  const typeFactor = multiplier.min + Math.random() * (multiplier.max - multiplier.min);
  return landPrice *
    typeFactor *
    (condition / 100) *
    (1 + 0.02 * upgradeLevel) *
    (1 + synergyRentBonus);
}

export function calculateRent(
  marketValue: number,
  type: PropertyType,
  occupancy: number,
  synergyRentBonus: number
): number {
  const annualRendite = PROPERTY_RENDITES[type];
  const perTurnRendite = annualRendite / 10; // 10 turns = 1 year
  return marketValue *
    perTurnRendite *
    (occupancy / 100) *
    (1 + synergyRentBonus);
}

export function calculateMaintenance(
  purchasePrice: number,
  type: PropertyType,
  condition: number
): number {
  const rate = PROPERTY_MAINTENANCE[type];
  return purchasePrice * rate * (1 + 0.5 * (1 - condition / 100));
}

export function calculateOccupancy(
  demand: number,
  crime: number,
  prestige: number,
  rent: number,
  marketRent: number
): number {
  const rentRatio = marketRent > 0 ? Math.min(rent / marketRent, 2) : 1;
  return Math.max(10, Math.min(100,
    60 + (demand / 2) - (rentRatio * 30) - (crime / 5) + (prestige / 5)
  ));
}

export function calculateCreditRating(
  totalAssets: number,
  avgAssets: number,
  image: number,
  cashflow: number,
  portfolioDiversity: number
): number {
  const wealthScore = avgAssets > 0 ? (totalAssets / avgAssets) * 30 : 20;
  const imageScore = image * 0.2;
  const cashflowScore = Math.min(20, Math.max(-10, cashflow / 100));
  const diversityScore = Math.min(20, portfolioDiversity * 5);

  return Math.min(100, Math.max(0,
    wealthScore + imageScore + cashflowScore + diversityScore
  ));
}

export function calculateLoanLimit(totalAssets: number, creditRating: number): number {
  const factor = getCreditLimitFactor(creditRating);
  return Math.max(50000, totalAssets * factor);
}

export function getInterestRate(creditRating: number): number {
  if (creditRating <= 20) return 0.015; // 18% p.a. → 1.5% per turn
  if (creditRating <= 40) return 0.010; // 12%
  if (creditRating <= 60) return 0.0067; // 8%
  if (creditRating <= 80) return 0.0042; // 5%
  return 0.0025; // 3%
}

function getCreditLimitFactor(creditRating: number): number {
  if (creditRating <= 20) return 0.10;
  if (creditRating <= 40) return 0.25;
  if (creditRating <= 60) return 0.50;
  if (creditRating <= 80) return 0.80;
  return 1.0;
}

export function calculateTaxes(marketValue: number, rentIncome: number): number {
  const propertyTax = marketValue * 0.002;
  const businessTax = rentIncome * 0.015;
  return propertyTax + businessTax;
}

export function getPurchaseTax(purchasePrice: number): number {
  return purchasePrice * 0.035;
}

export function getRenovationCost(marketValue: number, currentCondition: number): number {
  const improvement = 100 - currentCondition;
  return marketValue * 0.1 * (improvement / 100);
}

export function getUpgradeCost(marketValue: number, upgradeLevel: number): number {
  return marketValue * 0.15 * (upgradeLevel + 1);
}

export function calculateMarketPhaseDuration(phase: MarketPhase): number {
  const config = MARKET_CYCLES[phase];
  return config.duration.min + Math.floor(Math.random() * (config.duration.max - config.duration.min + 1));
}