export interface GameState {
  id: string;
  state: string;
  turn: number;
  marketPhase: string;
  players: Player[];
  districts: District[];
  properties: Property[];
  events: GameEvent[];
  loans: Loan[];
}

export interface Player {
  id: string;
  gameId: string;
  name: string;
  type: string;
  personality?: string;
  capital: number;
  influence: number;
  image: number;
  creditLimit: number;
  totalLoan: number;
  marketShare: number;
  cashflow: number;
  isBankrupt: boolean;
}

export interface District {
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

export interface Property {
  id: string;
  gameId: string;
  districtId: string;
  playerId: string | null;
  type: string;
  plotIndex: number;
  purchasePrice: number;
  marketValue: number;
  maintenance: number;
  rent: number;
  occupancy: number;
  condition: number;
  prestige: number;
  upgradeLevel: number;
  forSale: boolean;
}

export interface GameEvent {
  id: string;
  name: string;
  type: string;
  targetDistrictId: string | null;
  remaining: number;
}

export interface Loan {
  id: string;
  playerId: string;
  amount: number;
  interestRate: number;
  remaining: number;
  duration: number;
}