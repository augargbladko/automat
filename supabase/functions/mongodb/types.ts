
export enum UserStatus {
  none = "none",
  created = "created",
  funded = "funded",
  collected = "collected",
  converted = "converted",
  withdrawn = "withdrawn",
  nsf = "nsf",
  error = "error",
}

export interface SupabaseUser {
  telegram_id: number
  is_premium: boolean
  first_name: string
  username: string
  wallet_id: number
  wallet_address: string
  email: string
  confirmed_email: boolean
  user_level: number
  treasure: number
  spend: number
  spend_total: number
  time_zone: string
  referred_by_id: number
  referral_group: number
  referral_pos: number
  user_status: UserStatus
  user_Error: string
  operating_system: string
  browser: string
  category: string
  screen_resolution: string
  city: string
  country_id: string
  region_id: string
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


export interface MongoUser {
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

export interface MongoUserUpdate {
  createdAt?: Date
  createdDay?: string
  pointsBalance?: number
  tokenBalance?: number
  itemsOwnedState?: ItemsOwnedState
  slotsPlayState?: SlotsPlayState
  dailyQuests?: DailyQuests
  goldenSpinState?: GoldenSpinState
  slotsLastPlayed?: string
  lastLoginDay?: string
  loginBonusStreak?: number
  loginPointsToCollect?: number
  level?: number
  tonSpend?: number
  starsSpend?: number
}

export enum PackageType {
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