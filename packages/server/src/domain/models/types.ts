// ─── DOMAIN: TYPES ──────────────────────────────────────

export type PropertyType =
  | 'APARTMENT' | 'MULTI_FAMILY_HOUSE' | 'LUXURY_APARTMENT'
  | 'OFFICE' | 'HOTEL' | 'WAREHOUSE' | 'SHOPPING_CENTER'
  | 'INDUSTRIAL' | 'LAND' | 'RENOVATION_OBJECT';

export type MarketPhase = 'BOOM' | 'NORMAL' | 'RECESSION' | 'CRASH';
export type PlayerType = 'HUMAN' | 'BOT';
export type BotPersonality =
  | 'AGGRESSIVE_INVESTOR' | 'SPECULATOR' | 'DEFENSIVE_LANDLORD'
  | 'LUXURY_DEVELOPER' | 'BARGAIN_HUNTER' | 'RISK_INVESTOR';
export type EventType =
  | 'BOOM' | 'CRASH' | 'NEW_SUBWAY' | 'NEW_TRAIN_STATION'
  | 'NEW_AIRPORT' | 'CORPORATION_RELOCATION' | 'SUBSIDIES'
  | 'TAX_CHANGE' | 'HOUSING_SHORTAGE' | 'SCANDAL' | 'CORRUPTION'
  | 'FIRE' | 'FLOOD' | 'NATURAL_DISASTER' | 'CRIME_WAVE';

// ─── INTERFACES ────────────────────────────────────────

export interface DistrictData {
  id: string;
  gameId: string;
  name: string;
  districtIndex: number;
  demand: number;
  prestige: number;
  crime: number;
  traffic: number;
  growth: number;
  rentLevel: number;
  baseLandPrice: number;
  maxPlots: number;
}

export interface PropertyData {
  id: string;
  gameId: string;
  districtId: string;
  playerId: string | null;
  type: PropertyType;
  plotIndex: number;
  purchasePrice: number;
  marketValue: number;
  maintenance: number;
  rent: number;
  occupancy: number;
  condition: number;
  prestige: number;
  upgradeLevel: number;
  ownedSince: number;
  isMortgaged: boolean;
  forSale: boolean;
  salePrice: number | null;
}

export interface PlayerData {
  id: string;
  gameId: string;
  name: string;
  type: PlayerType;
  personality?: BotPersonality;
  capital: number;
  influence: number;
  image: number;
  creditLimit: number;
  totalLoan: number;
  marketShare: number;
  cashflow: number;
  isBankrupt: boolean;
  bankruptcyProtection: number;
}

export interface GameState {
  id: string;
  state: string;
  turn: number;
  marketPhase: MarketPhase;
  players: PlayerData[];
  districts: DistrictData[];
  events: any[];
}

export interface SynergyBonus {
  minOwned: number;
  name: string;
  description: string;
  rentBonus: number;
  prestigeBonus: number;
}

export interface MarketCycleConfig {
  phase: MarketPhase;
  priceMultiplier: number;
  demandMultiplier: number;
  duration: { min: number; max: number };
}

export interface LoanData {
  id: string;
  playerId: string;
  gameId: string;
  amount: number;
  interestRate: number;
  remaining: number;
  takenAt: number;
  duration: number;
}

// ─── CONSTANTS ─────────────────────────────────────────

export const PROPERTY_RENDITES: Record<PropertyType, number> = {
  APARTMENT: 0.05,
  MULTI_FAMILY_HOUSE: 0.055,
  LUXURY_APARTMENT: 0.03,
  OFFICE: 0.06,
  HOTEL: 0.07,
  WAREHOUSE: 0.08,
  SHOPPING_CENTER: 0.04,
  INDUSTRIAL: 0.07,
  LAND: 0,
  RENOVATION_OBJECT: 0.02,
};

export const PROPERTY_MAINTENANCE: Record<PropertyType, number> = {
  APARTMENT: 0.0015,
  MULTI_FAMILY_HOUSE: 0.002,
  LUXURY_APARTMENT: 0.003,
  OFFICE: 0.0025,
  HOTEL: 0.004,
  WAREHOUSE: 0.001,
  SHOPPING_CENTER: 0.0035,
  INDUSTRIAL: 0.003,
  LAND: 0.0002,
  RENOVATION_OBJECT: 0.005,
};

export const PROPERTY_VALUE_MULTIPLIER: Record<PropertyType, { min: number; max: number }> = {
  APARTMENT: { min: 0.8, max: 1.2 },
  MULTI_FAMILY_HOUSE: { min: 1.0, max: 1.5 },
  LUXURY_APARTMENT: { min: 1.5, max: 3.0 },
  OFFICE: { min: 1.2, max: 2.0 },
  HOTEL: { min: 1.5, max: 3.5 },
  WAREHOUSE: { min: 0.5, max: 0.8 },
  SHOPPING_CENTER: { min: 3.0, max: 5.0 },
  INDUSTRIAL: { min: 0.8, max: 1.5 },
  LAND: { min: 0.3, max: 1.0 },
  RENOVATION_OBJECT: { min: 0.3, max: 0.6 },
};

export const MARKET_CYCLES: Record<MarketPhase, MarketCycleConfig> = {
  BOOM: { phase: 'BOOM', priceMultiplier: 1.3, demandMultiplier: 1.4, duration: { min: 3, max: 7 } },
  NORMAL: { phase: 'NORMAL', priceMultiplier: 1.0, demandMultiplier: 1.0, duration: { min: 5, max: 15 } },
  RECESSION: { phase: 'RECESSION', priceMultiplier: 0.75, demandMultiplier: 0.7, duration: { min: 4, max: 10 } },
  CRASH: { phase: 'CRASH', priceMultiplier: 0.5, demandMultiplier: 0.4, duration: { min: 1, max: 3 } },
};

export const SYNERGY_BONUSES: SynergyBonus[] = [
  { minOwned: 5, name: 'Einkommensbonus', description: '+10 % Mieteinnahmen', rentBonus: 0.1, prestigeBonus: 0 },
  { minOwned: 10, name: 'Hausverwaltung', description: 'Auto-Vermietung, −10 % Leerstand', rentBonus: 0, prestigeBonus: 0 },
  { minOwned: 20, name: 'Quartiersbonus', description: '+20 Prestige', rentBonus: 0, prestigeBonus: 20 },
  { minOwned: 50, name: 'Großprojekt', description: 'Spezial-Gebäude errichtbar', rentBonus: 0, prestigeBonus: 0 },
  { minOwned: 100, name: 'Skyline-Projekt', description: '+30 % Einnahmen gesamter Bezirk', rentBonus: 0.3, prestigeBonus: 0 },
];

export const DISTRICT_NAMES = [
  'Mitte', 'Altstadt', 'Neustadt', 'Hafenviertel', 'Industriegebiet',
  'Studentenviertel', 'Gartenvorstadt', 'Geschäftsviertel', 'Künstlerviertel',
  'Bergblick', 'Seepromenade', 'Bahnhofsviertel', 'Universitätsviertel',
  'Gewerbepark', 'Villengegend', 'Chinatown', 'Medienviertel', 'Hightech-Park'
];

export const BOT_NAMES: Record<BotPersonality, string> = {
  AGGRESSIVE_INVESTOR: 'Maximus Invest',
  SPECULATOR: 'Spekulant Schmitz',
  DEFENSIVE_LANDLORD: 'Günther Gemütlich',
  LUXURY_DEVELOPER: 'Baroness von Lux',
  BARGAIN_HUNTER: 'Schnäppchen-Susi',
  RISK_INVESTOR: 'Risiko-Rudi',
};