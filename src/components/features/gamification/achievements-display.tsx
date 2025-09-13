"use client";

import { Achievement, UserAchievement } from "@/types";
import { Trophy, Star, Clock, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AchievementsDisplayProps {
  achievements: UserAchievement[];
  allAchievements: Achievement[];
  className?: string;
  compact?: boolean;
}

export function AchievementsDisplay({
  achievements,
  allAchievements,
  className = "",
  compact = false,
}: AchievementsDisplayProps) {
  const unlockedIds = new Set(achievements.map((a) => a.achievementId));
  const unlockedAchievements = allAchievements.filter((a) =>
    unlockedIds.has(a.id)
  );
  const lockedAchievements = allAchievements.filter(
    (a) => !unlockedIds.has(a.id)
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "streak":
        return <Zap className="w-5 h-5" />;
      case "xp":
        return <Star className="w-5 h-5" />;
      case "lessons":
        return <Target className="w-5 h-5" />;
      case "time":
        return <Clock className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "streak":
        return "text-orange-500";
      case "xp":
        return "text-yellow-500";
      case "lessons":
        return "text-blue-500";
      case "time":
        return "text-green-500";
      default:
        return "text-purple-500";
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Trophy className="w-5 h-5 text-yellow-500" />
        <span className="font-bold text-lg">{achievements.length}</span>
        <span className="text-sm text-gray-500">achievements</span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h3 className="font-bold text-lg">Achievements</h3>
        <span className="text-sm text-gray-500">
          ({achievements.length}/{allAchievements.length})
        </span>
      </div>

      <div className="space-y-3">
        {/* Unlocked Achievements */}
        {unlockedAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="text-green-500">
              {getCategoryIcon(achievement.category)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-green-800">
                {achievement.name}
              </div>
              <div className="text-sm text-green-600">
                {achievement.description}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-green-700">
                +{achievement.xpReward} XP
              </div>
            </div>
          </div>
        ))}

        {/* Locked Achievements */}
        {lockedAchievements.slice(0, 3).map((achievement) => (
          <div
            key={achievement.id}
            className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
          >
            <div className="text-gray-400">
              {getCategoryIcon(achievement.category)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-600">
                {achievement.name}
              </div>
              <div className="text-sm text-gray-500">
                {achievement.description}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {achievement.requirement} required
              </div>
            </div>
          </div>
        ))}

        {lockedAchievements.length > 3 && (
          <div className="text-center text-sm text-gray-500">
            +{lockedAchievements.length - 3} more achievements to unlock
          </div>
        )}
      </div>
    </div>
  );
}
