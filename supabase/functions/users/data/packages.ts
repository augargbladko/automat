import { PackageType } from "./types.ts";


export interface ItemPackage {
  itemId: number;
  itemType:
    | typeof PackageType.tool
    | typeof PackageType.treasure
    | typeof PackageType.elixir
    | typeof PackageType.potion;
  tonPrice: number; // Price in TON
  bonus: number; // Bonus multiplier for the item, if applicable
  duration?: number; // Duration in milliseconds for items like potions and elixirs
}

export const ITEM_PACKAGES: ItemPackage[] = [
  {
    itemId: 1,
    itemType: PackageType.elixir,
    tonPrice: 0.5,
    bonus: 2,
    duration: 1800000, // 30 min
  },
  {
    itemId: 2,
    itemType: PackageType.elixir,
    tonPrice: 1,
    bonus: 3,
    duration: 5400000, // 1 hour
  },
  {
    itemId: 3,
    itemType: PackageType.elixir,
    tonPrice: 2,
    bonus: 5,
    duration: 5400000, // 1 hour
  },
  {
    itemId: 4,
    itemType: PackageType.elixir,
    tonPrice: 5,
    bonus: 10,
    duration: 3600000 * 3, // 3 hours
  },
  {
    itemId: 1,
    itemType: PackageType.potion,
    tonPrice: 0.8,
    bonus: 2,
    duration: 1800000, // 30 min
  },
  {
    itemId: 2,
    itemType: PackageType.potion,
    tonPrice: 1.5,
    bonus: 3,
    duration: 5400000, // 1 hour
  },
  {
    itemId: 3,
    itemType: PackageType.potion,
    tonPrice: 3,
    bonus: 5,
    duration: 5400000, // 1 hour
  },
  {
    itemId: 4,
    itemType: PackageType.potion,
    tonPrice: 8,
    bonus: 10,
    duration: 3600000 * 3, // 3 hours
  },
  {
    itemId: 1,
    itemType: PackageType.treasure,
    tonPrice: 1,
    bonus: 10000,
  },
  {
    itemId: 2,
    itemType: PackageType.treasure,
    tonPrice: 2,
    bonus: 20000,
  },
  {
    itemId: 3,
    itemType: PackageType.treasure,
    tonPrice: 5,
    bonus: 50000,
  },
  {
    itemId: 4,
    itemType: PackageType.treasure,
    tonPrice: 10,
    bonus: 100000,
  },
  {
    itemId: 1,
    itemType: PackageType.tool,
    tonPrice: 2,
    bonus: -25,
  },
  {
    itemId: 2,
    itemType: PackageType.tool,
    tonPrice: 5,
    bonus: -50,
  },
  {
    itemId: 3,
    itemType: PackageType.tool,
    tonPrice: 10,
    bonus: -75,
  },
  {
    itemId: 4,
    itemType: PackageType.tool,
    tonPrice: 20,
    bonus: -100,
  },
];

// BRAND-SPECIFIC
export interface LevelPackage {
  id: number;
  level: number;
  tonPrice: number;
  tonCumulative: number;
  multiplier: number;
}

export const LEVEL_PACKAGES: LevelPackage[] = [
  {
    id: 1,
    level: 0,
    tonPrice: 0,
    tonCumulative: 0,
    multiplier: 1,
  },
  {
    id: 2,
    level: 1,
    tonPrice: 0.5,
    tonCumulative: 0.5,
    multiplier: 2,
  },
  {
    id: 3,
    level: 2,
    tonPrice: 0.5,
    tonCumulative: 1,
    multiplier: 3,
  },
  {
    id: 4,
    level: 3,
    tonPrice: 1,
    tonCumulative: 2,
    multiplier: 4,
  },
  {
    id: 5,
    level: 4,
    tonPrice: 2,
    tonCumulative: 4,
    multiplier: 5,
  },
  {
    id: 6,
    level: 5,
    tonPrice: 2,
    tonCumulative: 6,
    multiplier: 6,
  },
  {
    id: 7,
    level: 6,
    tonPrice: 3,
    tonCumulative: 9,
    multiplier: 8,
  },
  {
    id: 8,
    level: 7,
    tonPrice: 3,
    tonCumulative: 12,
    multiplier: 10,
  },
  {
    id: 9,
    level: 8,
    tonPrice: 4,
    tonCumulative: 16,
    multiplier: 12,
  },
  {
    id: 10,
    level: 9,
    tonPrice: 4,
    tonCumulative: 20,
    multiplier: 15,
  },
  {
    id: 11,
    level: 10,
    tonPrice: 5,
    tonCumulative: 25,
    multiplier: 20,
  },
];

export function getLevelPackageData(level: number): LevelPackage | undefined {
  return LEVEL_PACKAGES.find((p) => p.level === level) || undefined;
}

export function getLevelPackageById(id: number): LevelPackage | undefined {
  return LEVEL_PACKAGES.find((p) => p.id === id) || undefined;
}

export function getTokenPackageData(level: number): TokenPackage | undefined {
  return TOKEN_PACKAGES.find((p) => p.minLevel === level) || undefined;
}

export function getPointsPackageData(id: number): PointsPackage {
  return POINTS_PACKAGES.find((p) => p.id === id) || POINTS_PACKAGES[0];
}

export interface TokenPackage {
  id: number;
  minLevel: number;
  pointsPrice: number;
  tokensReceived: number;
}

export const TOKEN_PACKAGES: TokenPackage[] = [
  { id: 1, minLevel: 1, pointsPrice: 5000000, tokensReceived: 100000 },
  { id: 2, minLevel: 1, pointsPrice: 7500000, tokensReceived: 140000 },
  { id: 3, minLevel: 1, pointsPrice: 15000000, tokensReceived: 200000 },
  { id: 4, minLevel: 1, pointsPrice: 30000000, tokensReceived: 300000 },
  { id: 5, minLevel: 2, pointsPrice: 45000000, tokensReceived: 400000 },
  { id: 6, minLevel: 2, pointsPrice: 70000000, tokensReceived: 600000 },
  { id: 7, minLevel: 2, pointsPrice: 100000000, tokensReceived: 1000000 },
  { id: 8, minLevel: 3, pointsPrice: 150000000, tokensReceived: 1400000 },
  { id: 9, minLevel: 3, pointsPrice: 225000000, tokensReceived: 2000000 },
  { id: 10, minLevel: 4, pointsPrice: 350000000, tokensReceived: 3000000 },
  { id: 11, minLevel: 4, pointsPrice: 500000000, tokensReceived: 4000000 },
  { id: 12, minLevel: 5, pointsPrice: 1000000000, tokensReceived: 6000000 },
  { id: 13, minLevel: 5, pointsPrice: 1500000000, tokensReceived: 8000000 },
  { id: 14, minLevel: 6, pointsPrice: 2500000000, tokensReceived: 12000000 },
  { id: 15, minLevel: 6, pointsPrice: 5000000000, tokensReceived: 20000000 },
  { id: 16, minLevel: 7, pointsPrice: 10000000000, tokensReceived: 40000000 },
  { id: 17, minLevel: 8, pointsPrice: 20000000000, tokensReceived: 60000000 },
  { id: 18, minLevel: 9, pointsPrice: 50000000000, tokensReceived: 120000000 },
  {
    id: 19,
    minLevel: 10,
    pointsPrice: 100000000000,
    tokensReceived: 200000000,
  },
  {
    id: 20,
    minLevel: 10,
    pointsPrice: 200000000000,
    tokensReceived: 300000000,
  },
  {
    id: 21,
    minLevel: 10,
    pointsPrice: 500000000000,
    tokensReceived: 600000000,
  },
  {
    id: 22,
    minLevel: 10,
    pointsPrice: 1000000000000,
    tokensReceived: 1200000000,
  },
  {
    id: 23,
    minLevel: 10,
    pointsPrice: 2000000000000,
    tokensReceived: 2400000000,
  },
  {
    id: 24,
    minLevel: 10,
    pointsPrice: 3000000000000,
    tokensReceived: 3600000000,
  },
  {
    id: 25,
    minLevel: 10,
    pointsPrice: 4000000000000,
    tokensReceived: 4800000000,
  },
];

/* 
TODO halve the token packages soon
export const TOKEN_PACKAGES: TokenPackage[] = [
  { id: 1, minLevel: 1, pointsPrice: 5000000, tokensReceived: 50000 },
  { id: 2, minLevel: 1, pointsPrice: 7500000, tokensReceived: 70000 },
  { id: 3, minLevel: 1, pointsPrice: 15000000, tokensReceived: 100000 },
  { id: 4, minLevel: 1, pointsPrice: 30000000, tokensReceived: 150000 },
  { id: 5, minLevel: 2, pointsPrice: 45000000, tokensReceived: 200000 },
  { id: 6, minLevel: 2, pointsPrice: 70000000, tokensReceived: 300000 },
  { id: 7, minLevel: 2, pointsPrice: 100000000, tokensReceived: 500000 },
  { id: 8, minLevel: 3, pointsPrice: 150000000, tokensReceived: 700000 },
  { id: 9, minLevel: 3, pointsPrice: 225000000, tokensReceived: 1000000 },
  { id: 10, minLevel: 4, pointsPrice: 350000000, tokensReceived: 1500000 },
  { id: 11, minLevel: 4, pointsPrice: 500000000, tokensReceived: 2000000 },
  { id: 12, minLevel: 5, pointsPrice: 1000000000, tokensReceived: 3000000 },
  { id: 13, minLevel: 5, pointsPrice: 1500000000, tokensReceived: 4000000 },
  { id: 14, minLevel: 6, pointsPrice: 2500000000, tokensReceived: 6000000 },
  { id: 15, minLevel: 6, pointsPrice: 5000000000, tokensReceived: 10000000 },
  { id: 16, minLevel: 7, pointsPrice: 10000000000, tokensReceived: 20000000 },
  { id: 17, minLevel: 8, pointsPrice: 20000000000, tokensReceived: 30000000 },
  { id: 18, minLevel: 9, pointsPrice: 50000000000, tokensReceived: 60000000 },
  {
    id: 19,
    minLevel: 10,
    pointsPrice: 100000000000,
    tokensReceived: 100000000,
  },
  {
    id: 20,
    minLevel: 10,
    pointsPrice: 200000000000,
    tokensReceived: 150000000,
  },
  {
    id: 21,
    minLevel: 10,
    pointsPrice: 500000000000,
    tokensReceived: 300000000,
  },
  {
    id: 22,
    minLevel: 10,
    pointsPrice: 1000000000000,
    tokensReceived: 600000000,
  },
  {
    id: 23,
    minLevel: 10,
    pointsPrice: 2000000000000,
    tokensReceived: 1200000000,
  },
  {
    id: 24,
    minLevel: 10,
    pointsPrice: 3000000000000,
    tokensReceived: 1800000000,
  },
  {
    id: 25,
    minLevel: 10,
    pointsPrice: 4000000000000,
    tokensReceived: 2400000000,
  },
];*/

export interface PointsPackage {
  id: number;
  tonPrice: number;
  pointsReceived: number;
}

// Total points spend: 1,875M
export const POINTS_PACKAGES: PointsPackage[] = [
  { id: 1, tonPrice: 0.5, pointsReceived: 1000000000 },
  { id: 2, tonPrice: 1, pointsReceived: 3000000000 },
  { id: 3, tonPrice: 1.5, pointsReceived: 5000000000 },
  { id: 4, tonPrice: 2, pointsReceived: 8000000000 },
  { id: 5, tonPrice: 2.5, pointsReceived: 10000000000 },
  { id: 6, tonPrice: 3, pointsReceived: 12000000000 },
  { id: 7, tonPrice: 4, pointsReceived: 16000000000 },
  { id: 8, tonPrice: 5, pointsReceived: 20000000000 },
  { id: 9, tonPrice: 6, pointsReceived: 25000000000 },
  { id: 10, tonPrice: 7, pointsReceived: 30000000000 },
  { id: 11, tonPrice: 8, pointsReceived: 35000000000 },
  { id: 12, tonPrice: 9, pointsReceived: 40000000000 },
  { id: 13, tonPrice: 10, pointsReceived: 50000000000 },
  { id: 14, tonPrice: 12, pointsReceived: 60000000000 },
  { id: 15, tonPrice: 14, pointsReceived: 70000000000 },
  { id: 16, tonPrice: 16, pointsReceived: 80000000000 },
  { id: 17, tonPrice: 18, pointsReceived: 90000000000 },
  { id: 18, tonPrice: 20, pointsReceived: 100000000000 },
  { id: 19, tonPrice: 25, pointsReceived: 125000000000 },
  { id: 20, tonPrice: 30, pointsReceived: 150000000000 },
  { id: 21, tonPrice: 40, pointsReceived: 200000000000 },
  { id: 22, tonPrice: 50, pointsReceived: 250000000000 },
  { id: 23, tonPrice: 60, pointsReceived: 300000000000 },
  { id: 24, tonPrice: 80, pointsReceived: 400000000000 },
  { id: 25, tonPrice: 100, pointsReceived: 500000000000 },
  { id: 26, tonPrice: 120, pointsReceived: 600000000000 },
  { id: 27, tonPrice: 140, pointsReceived: 700000000000 },
  { id: 28, tonPrice: 160, pointsReceived: 800000000000 },
  { id: 29, tonPrice: 180, pointsReceived: 900000000000 },
  { id: 30, tonPrice: 200, pointsReceived: 1000000000000 },
  { id: 31, tonPrice: 250, pointsReceived: 1250000000000 },
  { id: 32, tonPrice: 300, pointsReceived: 1500000000000 },
  { id: 33, tonPrice: 350, pointsReceived: 1750000000000 },
  { id: 34, tonPrice: 400, pointsReceived: 2000000000000 },
  { id: 35, tonPrice: 450, pointsReceived: 2250000000000 },
  { id: 36, tonPrice: 500, pointsReceived: 2500000000000 },
  { id: 37, tonPrice: 550, pointsReceived: 2750000000000 },
  { id: 38, tonPrice: 600, pointsReceived: 3000000000000 },
  { id: 39, tonPrice: 650, pointsReceived: 3250000000000 },
  { id: 40, tonPrice: 700, pointsReceived: 3500000000000 },
  { id: 41, tonPrice: 750, pointsReceived: 3750000000000 },
  { id: 42, tonPrice: 800, pointsReceived: 4000000000000 },
];
