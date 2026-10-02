import type { Rewards } from "./solve";

// The empty rewards value for client components, which cannot import
// src/lib/solve.ts itself because that file talks to the database.
export const noRewardsClient: Rewards = { hintEarned: false, dailyBonus: false, awards: [] };
