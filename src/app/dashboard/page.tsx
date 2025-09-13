"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { XpLevelDisplay } from "@/components/features/gamification/xp-level-display";
import { StreakDisplay } from "@/components/features/gamification/streak-display";
import { AchievementsDisplay } from "@/components/features/gamification/achievements-display";
import { calculateLevel, calculateStreakData } from "@/lib/utils/gamification";
import { BookOpen, Target, Clock, Trophy } from "lucide-react";

// Mock data - replace with real data from your API
const mockUser = {
  xp: 2450,
  streak: 7,
  lastActiveAt: new Date(),
  totalLessons: 45,
  totalTime: 1200, // minutes
};

const mockAchievements = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first lesson",
    category: "lessons",
    requirement: 1,
    xpReward: 50,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Streak Master",
    description: "Maintain a 7-day streak",
    category: "streak",
    requirement: 7,
    xpReward: 100,
    isActive: true,
    createdAt: new Date(),
  },
];

const mockUserAchievements = [
  {
    id: "1",
    userId: "1",
    achievementId: "1",
    unlockedAt: new Date(),
    achievement: mockAchievements[0],
  },
];

const mockSubjects = [
  {
    id: "1",
    name: "JavaScript Basics",
    description: "Learn the fundamentals of JavaScript",
    icon: "📚",
    color: "blue",
    progress: 75,
  },
  {
    id: "2",
    name: "React Components",
    description: "Master React component patterns",
    icon: "⚛️",
    color: "green",
    progress: 45,
  },
  {
    id: "3",
    name: "TypeScript",
    description: "Type-safe JavaScript development",
    icon: "🔷",
    color: "purple",
    progress: 20,
  },
];

export default function DashboardPage() {
  const levelData = calculateLevel(mockUser.xp);
  const streakData = calculateStreakData(mockUser.lastActiveAt, mockUser.streak);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back! Ready to learn?
          </h1>
          <p className="text-blue-100">
            Keep your streak alive and continue your learning journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lessons</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockUser.totalLessons}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">XP Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockUser.xp.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(mockUser.totalTime / 60)}h
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockUserAchievements.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Learning Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level and Streak */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <XpLevelDisplay levelData={levelData} />
              <StreakDisplay streakData={streakData} />
            </div>

            {/* Subjects */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
              <div className="space-y-4">
                {mockSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{subject.icon}</span>
                      <div>
                        <h3 className="font-medium">{subject.name}</h3>
                        <p className="text-sm text-gray-600">
                          {subject.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {subject.progress}%
                      </div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className={`h-2 rounded-full bg-${subject.color}-500`}
                          style={{ width: `${subject.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Achievements */}
          <div>
            <AchievementsDisplay
              achievements={mockUserAchievements}
              allAchievements={mockAchievements}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
