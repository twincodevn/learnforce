import { User, LevelData, StreakData } from "@/types";

export const XP_PER_LEVEL = 1000;
export const XP_MULTIPLIER = 1.2;

export function calculateLevel(xp: number): LevelData {
  let level = 1;
  let xpForCurrentLevel = 0;
  let xpToNext = XP_PER_LEVEL;

  while (xp >= xpToNext) {
    xpForCurrentLevel = xpToNext;
    xp -= xpToNext;
    level++;
    xpToNext = Math.floor(XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1));
  }

  const progress = Math.floor((xp / xpToNext) * 100);

  return {
    current: level,
    xp: xp,
    xpToNext: xpToNext,
    progress,
  };
}

export function calculateXpToNextLevel(currentXp: number): number {
  const levelData = calculateLevel(currentXp);
  return levelData.xpToNext;
}

export function getXpReward(score: number, baseXp: number = 10): number {
  // Base XP multiplied by score percentage
  return Math.floor(baseXp * (score / 100));
}

export function getStreakBonus(streak: number): number {
  if (streak < 3) return 0;
  if (streak < 7) return 1; // 1x bonus
  if (streak < 14) return 2; // 2x bonus
  if (streak < 30) return 3; // 3x bonus
  return 5; // 5x bonus for 30+ days
}

export function calculateStreakData(
  lastActiveAt: Date | null,
  currentStreak: number
): StreakData {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (!lastActiveAt) {
    return {
      current: 0,
      longest: 0,
      isActive: false,
    };
  }

  const lastActive = new Date(lastActiveAt);
  const lastActiveDate = new Date(
    lastActive.getFullYear(),
    lastActive.getMonth(),
    lastActive.getDate()
  );

  const daysDiff = Math.floor(
    (today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let isActive = false;
  let current = currentStreak;

  if (daysDiff === 0) {
    // User was active today
    isActive = true;
  } else if (daysDiff === 1) {
    // User was active yesterday, streak continues
    isActive = true;
  } else {
    // Streak broken
    current = 0;
    isActive = false;
  }

  return {
    current,
    longest: Math.max(current, currentStreak),
    lastActiveDate: lastActiveAt,
    isActive,
  };
}

export function getLevelTitle(level: number): string {
  if (level < 5) return "Beginner";
  if (level < 10) return "Explorer";
  if (level < 20) return "Adventurer";
  if (level < 30) return "Expert";
  if (level < 50) return "Master";
  if (level < 100) return "Legend";
  return "Grandmaster";
}

export function getLevelColor(level: number): string {
  if (level < 5) return "text-gray-500";
  if (level < 10) return "text-green-500";
  if (level < 20) return "text-blue-500";
  if (level < 30) return "text-purple-500";
  if (level < 50) return "text-orange-500";
  if (level < 100) return "text-red-500";
  return "text-yellow-500";
}

export function formatTimeSpent(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

export function calculateWeeklyXp(progressHistory: any[]): number {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return progressHistory
    .filter((progress) => new Date(progress.createdAt) >= oneWeekAgo)
    .reduce((total, progress) => total + progress.xpEarned, 0);
}

export function calculateMonthlyXp(progressHistory: any[]): number {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return progressHistory
    .filter((progress) => new Date(progress.createdAt) >= oneMonthAgo)
    .reduce((total, progress) => total + progress.xpEarned, 0);
}
