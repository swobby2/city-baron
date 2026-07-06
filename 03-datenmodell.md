// Prisma Schema — City Baron Datenmodell
// Step 3: Data Model

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ─── SPIEL ──────────────────────────────────────────

model Game {
  id             String   @id @default(uuid())
  state          GameState
  turn           Int      @default(0)
  marketPhase    MarketPhase
  roundStartAt   DateTime @default(now())
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  districts   District[]
  players     Player[]
  events      GameEvent[]
  marketData  MarketData[]
}

enum GameState {
  LOBBY
  RUNNING
  FINISHED
}

enum MarketPhase {
  NORMAL
  BOOM
  RECESSION
  CRASH
}

// ─── SPIELER ────────────────────────────────────────

model Player {
  id        String   @id @default(uuid())
  gameId    String
  name      String
  type      PlayerType
  personality BotPersonality?

  // Resources
  capital    Float @default(100000)
  influence  Int   @default(10)
  image      Int   @default(50)
  creditLimit Float @default(50000)
  totalLoan  Float @default(0)
  marketShare Float @default(0)

  // Derived
  cashflow  Float @default(0)
  score     Int   @default(0)
  isBankrupt Boolean @default(false)
  bankruptcyProtection Int @default(2)

  createdAt DateTime @default(now())
  game      Game     @relation(fields: [gameId], references: [id])
  properties Property[]
  bids       Bid[]

  @@unique([gameId, name])
}

enum PlayerType {
  HUMAN
  BOT
}

enum BotPersonality {
  AGGRESSIVE_INVESTOR
  SPECULATOR
  DEFENSIVE_LANDLORD
  LUXURY_DEVELOPER
  BARGAIN_HUNTER
  RISK_INVESTOR
}

// ─── BEZIRK ─────────────────────────────────────────

model District {
  id            String  @id @default(uuid())
  gameId        String
  name          String
  districtIndex Int

  // Properties
  demand        Int @default(50)    // 0-100
  prestige      Int @default(50)    // 0-100
  crime         Int @default(30)    // 0-100
  traffic       Int @default(50)    // 0-100
  growth        Int @default(0)     // -5 to +5
  rentLevel     Int @default(5)     // 1-10
  baseLandPrice Float @default(10000)
  maxPlots      Int @default(15)

  game       Game       @relation(fields: [gameId], references: [id])
  properties Property[]

  @@unique([gameId, name])
  @@unique([gameId, districtIndex])
}

// ─── IMMOBILIE ──────────────────────────────────────

model Property {
  id          String         @id @default(uuid())
  playerId    String?
  districtId  String
  gameId      String

  type        PropertyType
  plotIndex   Int

  // Values
  purchasePrice  Float  @default(0)
  marketValue    Float  @default(0)
  maintenance    Float  @default(0)
  rent           Float  @default(0)
  occupancy      Int    @default(100)  // 0-100 %
  condition      Int    @default(100)  // 0-100 %
  prestige       Int    @default(50)   // 0-100
  upgradeLevel   Int    @default(0)

  ownedSince  Int      @default(0)
  isMortgaged Boolean  @default(false)
  forSale     Boolean  @default(false)
  salePrice   Float?

  player   Player?   @relation(fields: [playerId], references: [id])
  district District  @relation(fields: [districtId], references: [id])
  game     Game      @relation(fields: [gameId], references: [id])

  @@unique([districtId, plotIndex])
}

enum PropertyType {
  APARTMENT
  MULTI_FAMILY_HOUSE
  LUXURY_APARTMENT
  OFFICE
  HOTEL
  WAREHOUSE
  SHOPPING_CENTER
  INDUSTRIAL
  LAND
  RENOVATION_OBJECT
}

// ─── KREDITE ────────────────────────────────────────

model Loan {
  id          String  @id @default(uuid())
  playerId    String
  gameId      String
  amount      Float
  interestRate Float
  remaining   Float
  takenAt     Int
  duration    Int     @default(20)

  player Player @relation(fields: [playerId], references: [id])
  game   Game   @relation(fields: [gameId], references: [id])
}

// ─── EVENTS ─────────────────────────────────────────

model GameEvent {
  id        String   @id @default(uuid())
  gameId    String
  name      String
  type      EventType
  targetDistrictId String?
  playerTargetId   String?
  duration  Int      @default(1)
  remaining Int      @default(1)
  params    Json     @default("{}")
  createdAt DateTime @default(now())

  game Game @relation(fields: [gameId], references: [id])
}

enum EventType {
  BOOM
  CRASH
  NEW_SUBWAY
  NEW_TRAIN_STATION
  NEW_AIRPORT
  CORPORATION_RELOCATION
  SUBSIDIES
  TAX_CHANGE
  HOUSING_SHORTAGE
  SCANDAL
  CORRUPTION
  FIRE
  FLOOD
  NATURAL_DISASTER
  CRIME_WAVE
}

// ─── MARKTDATEN (Historie) ──────────────────────────

model MarketData {
  id        String @id @default(uuid())
  gameId    String
  turn      Int
  avgPrice  Float
  avgDemand Float
  totalProperties Int
  soldProperties  Int

  game Game @relation(fields: [gameId], references: [id])
}

// ─── GEBIETE (Auktionen) ────────────────────────────

model Bid {
  id         String @id @default(uuid())
  playerId   String
  propertyId String
  gameId     String
  amount     Float
  createdAt  DateTime @default(now())

  player   Player   @relation(fields: [playerId], references: [id])
  property Property @relation(fields: [propertyId], references: [id])
  game     Game     @relation(fields: [gameId], references: [id])
}

// ─── AKTIONEN-LOG ───────────────────────────────────

model ActionLog {
  id        String   @id @default(uuid())
  gameId    String
  playerId  String?
  turn      Int
  action    String
  details   Json     @default("{}")
  createdAt DateTime @default(now())

  game Game @relation(fields: [gameId], references: [id])
}
