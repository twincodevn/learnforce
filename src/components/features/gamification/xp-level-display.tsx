"use client";

import { LevelData } from "@/types";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getLevelTitle, getLevelColor } from "@/lib/utils/gamification";
import { Trophy, Star } from "lucide-react";

interface XpLevelDisplayProps {
  levelData: LevelData;
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export function XpLevelDisplay({
  levelData,
  className = "",
  showTitle = true,
  compact = false,
}: XpLevelDisplayProps) {
  const { current, xp, xpToNext, progress } = levelData;
  const title = getLevelTitle(current);
  const colorClass = getLevelColor(current);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-bold text-lg">{current}</span>
        </div>
        <div className="flex-1 min-w-0">
          <ProgressBar
            value={xp}
            max={xpToNext}
            color="success"
            className="h-2"
          />
        </div>
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {xp}/{xpToNext} XP
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className={`w-6 h-6 ${colorClass}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-2xl">Level {current}</span>
              <span className={`text-sm font-medium ${colorClass}`}>
                {title}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{xp}</div>
          <div className="text-sm text-gray-500">XP</div>
        </div>
      </div>

      <ProgressBar
        value={xp}
        max={xpToNext}
        showLabel
        label={`${xpToNext - xp} XP to next level`}
        color="success"
        className="mb-2"
      />

      <div className="text-xs text-gray-500 text-center">
        {progress}% complete
      </div>
    </div>
  );
}
