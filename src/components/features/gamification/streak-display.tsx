"use client";

import { StreakData } from "@/types";
import { Flame, Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StreakDisplayProps {
  streakData: StreakData;
  className?: string;
  compact?: boolean;
}

export function StreakDisplay({
  streakData,
  className = "",
  compact = false,
}: StreakDisplayProps) {
  const { current, longest, lastActiveDate, isActive } = streakData;

  const getStreakColor = (streak: number) => {
    if (streak === 0) return "text-gray-400";
    if (streak < 3) return "text-orange-400";
    if (streak < 7) return "text-orange-500";
    if (streak < 14) return "text-red-500";
    if (streak < 30) return "text-red-600";
    return "text-red-700";
  };

  const getStreakIcon = (streak: number) => {
    if (streak === 0) return <Calendar className="w-5 h-5" />;
    if (streak < 7) return <Flame className="w-5 h-5" />;
    return <Flame className="w-6 h-6" />;
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`${getStreakColor(current)}`}>
          {getStreakIcon(current)}
        </div>
        <div>
          <span className="font-bold text-lg">{current}</span>
          <span className="text-sm text-gray-500 ml-1">day streak</span>
        </div>
        {!isActive && current > 0 && (
          <div className="text-xs text-red-500">
            <Clock className="w-3 h-3 inline mr-1" />
            Streak lost
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`${getStreakColor(current)}`}>
            {getStreakIcon(current)}
          </div>
          <div>
            <div className="font-bold text-xl">{current}</div>
            <div className="text-sm text-gray-500">Current Streak</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg text-gray-700">{longest}</div>
          <div className="text-sm text-gray-500">Best Streak</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status</span>
          <span
            className={`font-medium ${
              isActive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {lastActiveDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Active</span>
            <span className="text-gray-500">
              {formatDistanceToNow(lastActiveDate, { addSuffix: true })}
            </span>
          </div>
        )}

        {!isActive && current > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
            <div className="text-red-600 text-sm font-medium">
              ⚠️ Streak lost! Start learning to rebuild it.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
