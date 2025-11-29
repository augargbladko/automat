
interface GoldenSpinConsts {
  goldenSpinPrizes: WheelSlot[];
}

interface WheelSlot {
  result: number;
  points: number;
  tokens: number;
  chance: number;
}

const GOLDEN_SPIN_CONSTS: GoldenSpinConsts = {
  goldenSpinPrizes: [
    {
      result: 0,
      tokens: 25000,
      points: 0,
      chance: 0.12,
    },
    {
      result: 1,
      points: 200000000,
      tokens: 0,
      chance: 0.0005,
    },
    {
      result: 2,
      tokens: 500000,
      points: 0,
      chance: 0.009,
    },
    {
      result: 3,
      points: 25000000,
      tokens: 0,
      chance: 0.25,
    },
    {
      result: 4,
      tokens: 50000,
      points: 0,
      chance: 0.3,
    },
    {
      result: 5,
      tokens: 5000000,
      points: 0,
      chance: 0.0002,
    },
    {
      result: 6,
      points: 100000000,
      tokens: 0,
      chance: 0.05,
    },
    {
      result: 7,
      tokens: 150000,
      points: 0,
      chance: 0.05,
    },
    {
      result: 8,
      points: 10000000,
      tokens: 0,
      chance: 0.12,
    },
    {
      result: 9,
      tokens: 1000000,
      points: 0,
      chance: 0.0001,
    },
    {
      result: 10,
      points: 50000000,
      tokens: 0,
      chance: 0.1,
    },
    {
      result: 11,
      points: 500000000,
      tokens: 0,
      chance: 0.0002,
    },
  ],
};

export function getGoldenSpinResult(): WheelSlot {
  const totalOdds = GOLDEN_SPIN_CONSTS.goldenSpinPrizes.reduce(
    (acc, curr) => (acc = acc + curr.chance),
    0,
  );
  const roll = Math.random() * totalOdds;
  let inc = 0;
  for (let i = 0; i < GOLDEN_SPIN_CONSTS.goldenSpinPrizes.length; i++) {
    inc += GOLDEN_SPIN_CONSTS.goldenSpinPrizes[i].chance;
    if (roll < inc) {
      return GOLDEN_SPIN_CONSTS.goldenSpinPrizes[i];
    }
  }
  return GOLDEN_SPIN_CONSTS.goldenSpinPrizes[3];
}