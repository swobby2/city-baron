-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "state" TEXT NOT NULL DEFAULT 'RUNNING',
    "turn" INTEGER NOT NULL DEFAULT 0,
    "marketPhase" TEXT NOT NULL DEFAULT 'NORMAL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'HUMAN',
    "personality" TEXT,
    "capital" REAL NOT NULL DEFAULT 100000,
    "influence" INTEGER NOT NULL DEFAULT 10,
    "image" INTEGER NOT NULL DEFAULT 50,
    "creditLimit" REAL NOT NULL DEFAULT 50000,
    "totalLoan" REAL NOT NULL DEFAULT 0,
    "marketShare" REAL NOT NULL DEFAULT 0,
    "cashflow" REAL NOT NULL DEFAULT 0,
    "isBankrupt" BOOLEAN NOT NULL DEFAULT false,
    "bankruptcyProtection" INTEGER NOT NULL DEFAULT 2,
    CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "districtIndex" INTEGER NOT NULL,
    "demand" INTEGER NOT NULL DEFAULT 50,
    "prestige" INTEGER NOT NULL DEFAULT 50,
    "crime" INTEGER NOT NULL DEFAULT 30,
    "traffic" INTEGER NOT NULL DEFAULT 50,
    "growth" INTEGER NOT NULL DEFAULT 0,
    "rentLevel" INTEGER NOT NULL DEFAULT 5,
    "baseLandPrice" REAL NOT NULL DEFAULT 10000,
    "maxPlots" INTEGER NOT NULL DEFAULT 15,
    CONSTRAINT "District_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "playerId" TEXT,
    "type" TEXT NOT NULL,
    "plotIndex" INTEGER NOT NULL,
    "purchasePrice" REAL NOT NULL DEFAULT 0,
    "marketValue" REAL NOT NULL DEFAULT 0,
    "maintenance" REAL NOT NULL DEFAULT 0,
    "rent" REAL NOT NULL DEFAULT 0,
    "occupancy" INTEGER NOT NULL DEFAULT 100,
    "condition" INTEGER NOT NULL DEFAULT 100,
    "prestige" INTEGER NOT NULL DEFAULT 50,
    "upgradeLevel" INTEGER NOT NULL DEFAULT 0,
    "ownedSince" INTEGER NOT NULL DEFAULT 0,
    "isMortgaged" BOOLEAN NOT NULL DEFAULT false,
    "forSale" BOOLEAN NOT NULL DEFAULT false,
    "salePrice" REAL,
    CONSTRAINT "Property_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Property_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "interestRate" REAL NOT NULL,
    "remaining" REAL NOT NULL,
    "takenAt" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 20,
    CONSTRAINT "Loan_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Loan_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GameEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "targetDistrictId" TEXT,
    "playerTargetId" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 1,
    "remaining" INTEGER NOT NULL DEFAULT 1,
    "params" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GameEvent_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MarketData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "turn" INTEGER NOT NULL,
    "avgPrice" REAL NOT NULL,
    "avgDemand" REAL NOT NULL,
    "totalProperties" INTEGER NOT NULL,
    "soldProperties" INTEGER NOT NULL,
    CONSTRAINT "MarketData_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT,
    "turn" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActionLog_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_gameId_name_key" ON "Player"("gameId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "District_gameId_name_key" ON "District"("gameId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "District_gameId_districtIndex_key" ON "District"("gameId", "districtIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Property_districtId_plotIndex_key" ON "Property"("districtId", "plotIndex");
