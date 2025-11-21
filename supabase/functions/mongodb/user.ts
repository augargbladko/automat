import { generatePromoCode } from "./wordlist.ts";

export interface SupabaseUser {
  email: string | null
  username: string
  firstname: string
  telegramId: string
  isPremium: boolean
  id: number
  confirmedEmail: boolean
  level: number
  factor: number
  nugs: number
  ore: number
  spend: number
  cumSpend: number
  timeZone: string
  referredById: string | null
}

/*
  Referrals - who referred this user (and make the right call to give them the bonus)
  Achievements - what are their completed/current acheivements? (this will be a big gap, as we're not creating 100k of these objects?)

  All of these will be missing; it's not ideal.
      referredBy: Prisma.$UserPayload<ExtArgs> | null
      achievements: Prisma.$AchievementPayload<ExtArgs>[]
      completedTasks: Prisma.$UserTaskPayload<ExtArgs>[]
      quizResponses: Prisma.$QuizResponsePayload<ExtArgs>[]
      bonusCodes: Prisma.$BonusCodePayload<ExtArgs>[]
      adminEvents: Prisma.$AdminEventPayload<ExtArgs>[]
      tonPurchases: Prisma.$TonPurchasePayload<ExtArgs>[]
      tokenPurchases: Prisma.$TokenPurchasePayload<ExtArgs>[]
      invoices: Prisma.$UserInvoicePayload<ExtArgs>[]
*/


export function createFakeUser(data: SupabaseUser): MongoUser {
  const createdAt = new Date();
  createdAt.setUTCDate(createdAt.getUTCDate() - 45 - Math.floor(Math.random() * 30)); // random date within last 45-75 days
  const createdDay = createdAt.toISOString().split('T')[0];
  const walletAddress = '' // create from the wallet id
  const user: MongoUser = {
    createdAt: createdAt,
    createdDay: createdDay,
    telegramId: data.telegramId,
    name: data.firstname,
    isPremium: data.isPremium,
    pointsBalance: data.ore,
    tokenBalance: data.nugs,
    tonWalletAddress: walletAddress,
    promoCode: generatePromoCode(data.telegramId),
    promoUsed: false,
    promoUsedCount: 0,
    referralBonus: 0,
    referralTokensEarned: 0,
    token: null,
    referredById: null,
    referralCount: 0,
    itemsOwnedState: defaultItemsState(),
    slotsPlayState: defaultSlotsPlayState(),
    dailyQuests: null,
    goldenSpinState: {
      packageType: PackageType.none,
      packageId: 0,
      result: 0,
      readyToCollect: false,
      points: 0,
      tokens: 0,
    },
    slotsLastPlayed: createdDay,
    lastLoginDay: createdDay,
    loginBonusStreak: 0,
    loginPointsToCollect: 0,
    lastBonusCodeTimestamp: 0,
    level: data.level,
      userName: data.username,
      photoUrl: null,
      tonSpend: data.spend,
      starsSpend: 0,
    confirmedEmail: data.confirmedEmail ? data.email : null,
    requestedEmail: !data.confirmedEmail ? data.email : null,
  }
  return user;
}

interface MongoUser {
      createdAt: Date
      createdDay: string
      telegramId: string
      name: string | null
      isPremium: boolean
      pointsBalance: number
      tokenBalance: number
      tonWalletAddress: string | null
      promoCode: string | null
      promoUsed: boolean
      promoUsedCount: number
      referralBonus: number
      referralTokensEarned: number
      token: string | null
      referredById: string | null
      referralCount: number
      itemsOwnedState: ItemsOwnedState
      slotsPlayState: SlotsPlayState
  dailyQuests: DailyQuests | null
      goldenSpinState: GoldenSpinState
      slotsLastPlayed: string
      lastLoginDay: string
      loginBonusStreak: number
      loginPointsToCollect: number
      lastBonusCodeTimestamp: number
      level: number
      userName: string | null
      photoUrl: string | null
      tonSpend: number | null
      starsSpend: number | null
      requestedEmail: string | null
      confirmedEmail: string | null
}

enum PackageType {
  none = "none",
  test = "test",
  levels = "levels",
  points = "points",
  tokens = "tokens",
  elixir = "elixir",
  potion = "potion",
  tool = "tool",
  treasure = "treasure",
  lootBox = "lootBox",
}

export type GoldenSpinState = {
  packageType: PackageType;
  packageId: number;
  result: number;
  readyToCollect: boolean;
  points: number;
  tokens: number;
};

export type SlotsResult = {
  points: number;
  tokens: number;
  energy: number;
  level: number; // you must be this level to collect the tokens listed
  treasures: number[]; // treasure symbols, if any
  reels: [number, number, number];
  multipliers: [number, number, number]; // multipliers for each reel
  baseScores: [number, number, number]; // scores for each reel
  baseMult: number; // the base multiplier applied to the score (from user level or gold potion)
  doublesMult: number; // the multiplier from matching symbols on different reels
  cards?: [
    [number, number, number, number] | null,
    [number, number, number, number] | null,
    [number, number, number, number] | null,
  ]; // an array of CardResult id arrays - a valid array should either be empty or have 4 entries. Null if no card symbol was spun
};

export type Achievement = {
  difficulty: "EASY" | "MEDIUM" | "HARD";
  slug: string // stringified number
  progress: number
  isFinished: boolean
  userId: string
  createdAt: Date
}


export type SlotsPlayState = {
  lastPlayed: Date;
  energyAtLastPlay?: number;
  result: SlotsResult;
  totalPointsEarned: number;
  totalTokensEarned: number;
  totalSpins: number;
  achievements: Achievement[];
};

export type ItemsOwnedState = {
  tool: Record<number, number>;
  treasure: Record<number, number>;
  elixir: Record<number, number>;
  potion: Record<number, number>;
};

export type DailyQuests = {
  inviteOneFriend: string; // "2025-08-08"
}

export function defaultItemsState(): ItemsOwnedState {
  return {
    tool: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    },
    treasure: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    },
    potion: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    },
    elixir: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    },
  };
}

export function defaultSlotsResult(): SlotsResult {
  return {
    points: 0,
    tokens: 0,
    energy: 0,
    level: 0,
    reels: [0, 0, 0],
    treasures: [0, 0, 0, 0],
    multipliers: [1, 1, 1],
    baseScores: [0, 0, 0],
    baseMult: 1,
    doublesMult: 1,
  };
}

export function defaultSlotsPlayState(): SlotsPlayState {
  return {
    achievements: [],
    lastPlayed: new Date(0),
    result: defaultSlotsResult(),
    energyAtLastPlay: getMaxEnergy(0),
    totalPointsEarned: 0,
    totalTokensEarned: 0,
    totalSpins: 0,
  };
}

export function getCurrentEnergy(
  lastPlayed: Date,
  level: number,
  energyAtLastPlay: number | undefined,
): number {
  const secondsSinceLastPlay =
    (Date.now() - new Date(lastPlayed).getTime()) / 1000;
  const maxEnergy = getMaxEnergy(level);
  const energyPerSecond = getEnergyRecoveryRate(level); // L20 = 1/3min, L1 = 1/12 min
  return Math.min(
    Math.max(maxEnergy, energyAtLastPlay || 0), // If the current energy is higher than max (due to potions), keep it
    (energyAtLastPlay || 0) +
      Math.floor(secondsSinceLastPlay * energyPerSecond),
  );
}

export function getSpinEnergyCost(itemsOwnedState: ItemsOwnedState): number {
  const tools = itemsOwnedState?.tool || {};
  return (
    500 -
    (tools[1] ? 25 : 0) -
    (tools[2] ? 50 : 0) -
    (tools[3] ? 75 : 0) -
    (tools[4] ? 100 : 0) // min = 250 energy per spin
  );
}

export function getEnergyRecoveryRate(level: number): number {
  return getMaxEnergy(level) / 3600;
}

export function getMaxEnergy(level: number) {
  return level === 0 ? 2500 : level === 1 ? 5000 : 5000 + level * 500; // 5, 10, 12-20;
}