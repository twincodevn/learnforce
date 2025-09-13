"use client";

import { Bell, Search, User } from "lucide-react";
import { XpLevelDisplay } from "@/components/features/gamification/xp-level-display";
import { StreakDisplay } from "@/components/features/gamification/streak-display";
import { calculateLevel, calculateStreakData } from "@/lib/utils/gamification";

interface HeaderProps {
  user?: {
    xp: number;
    streak: number;
    lastActiveAt?: Date;
  };
}

export function Header({ user }: HeaderProps) {
  const levelData = user ? calculateLevel(user.xp) : calculateLevel(0);
  const streakData = user
    ? calculateStreakData(user.lastActiveAt, user.streak)
    : calculateStreakData(null, 0);

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" />
          <input
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search lessons, subjects..."
            type="search"
            name="search"
          />
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Gamification Stats */}
          <div className="hidden md:flex items-center gap-4">
            <XpLevelDisplay levelData={levelData} compact />
            <StreakDisplay streakData={streakData} compact />
          </div>

          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">View profile</span>
              <User className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
