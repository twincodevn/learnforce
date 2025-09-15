'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Users, 
  TrendingUp, 
  Clock, 
  Calendar,
  Zap,
  Star,
  ChevronRight,
  Play,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StreakCounter } from '@/components/features/gamification/StreakCounter';
import { XPLevelSystem } from '@/components/features/gamification/XPLevelSystem';

interface DashboardData {
  user: {
    name: string;
    username: string;
    level: number;
    xp: number;
    streak: number;
    avatar?: string;
  };
  stats: {
    totalLessons: number;
    timeSpent: number;
    weeklyXP: number;
    monthlyXP: number;
    rank: number;
    totalUsers: number;
  };
  recentActivity: {
    id: string;
    type: 'lesson' | 'achievement' | 'streak' | 'xp';
    title: string;
    description: string;
    timestamp: string;
    xp?: number;
  }[];
  friendsActivity: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    action: string;
    timestamp: string;
    xp?: number;
  }[];
  dailyGoals: {
    id: string;
    title: string;
    completed: boolean;
    xp: number;
    progress: number;
  }[];
  recentAchievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
  continueLearning: {
    subjectId: string;
    subjectName: string;
    lessonId: string;
    lessonTitle: string;
    progress: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  } | null;
}

export function DashboardOverview() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to basic data structure if API fails
        setDashboardData({
          user: {
            name: user?.name || 'Unknown User',
            username: (user as any)?.username || 'unknown',
            level: 1,
            xp: 0,
            streak: 0,
            avatar: user?.image || undefined
          },
          stats: {
            totalLessons: 0,
            timeSpent: 0,
            weeklyXP: 0,
            monthlyXP: 0,
            rank: 0,
            totalUsers: 0
          },
          recentActivity: [],
          friendsActivity: [],
          dailyGoals: [
            {
              id: 'lessons',
              title: 'Complete 3 lessons',
              completed: false,
              xp: 15,
              progress: 0
            },
            {
              id: 'xp',
              title: 'Earn 50 XP',
              completed: false,
              xp: 20,
              progress: 0
            },
            {
              id: 'time',
              title: 'Study for 30 minutes',
              completed: false,
              xp: 10,
              progress: 0
            }
          ],
          recentAchievements: [],
          continueLearning: null
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {dashboardData.user.name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Ready to continue your learning journey?
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Rank</div>
          <div className="text-2xl font-bold text-blue-600">
            #{dashboardData.stats.rank.toLocaleString()}
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          {dashboardData.continueLearning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-r from-green-500 to-blue-600 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Continue Learning</h2>
                    <p className="text-green-100">
                      {dashboardData.continueLearning.subjectName}
                    </p>
                  </div>
                  <Play className="w-8 h-8 text-green-200" />
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{dashboardData.continueLearning.lessonTitle}</span>
                    <span>{dashboardData.continueLearning.progress}%</span>
                  </div>
                  <ProgressBar 
                    value={dashboardData.continueLearning.progress} 
                    className="h-2 bg-white/20"
                    fillClassName="bg-white"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    {dashboardData.continueLearning.difficulty}
                  </span>
                  <Button className="bg-white text-green-600 hover:bg-green-50">
                    Continue Lesson
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Daily Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Today's Goals</h3>
              </div>
              
              <div className="space-y-3">
                {dashboardData.dailyGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      goal.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {goal.completed && <Award className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${
                          goal.completed ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {goal.title}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          +{goal.xp} XP
                        </span>
                      </div>
                      {!goal.completed && (
                        <ProgressBar 
                          value={goal.progress} 
                          className="h-1 mt-1"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              
              <div className="space-y-3">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'lesson' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                      activity.type === 'streak' ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {activity.type === 'lesson' && <BookOpen className="w-4 h-4" />}
                      {activity.type === 'achievement' && <Trophy className="w-4 h-4" />}
                      {activity.type === 'streak' && <Zap className="w-4 h-4" />}
                      {activity.type === 'xp' && <Star className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{activity.title}</div>
                      <div className="text-sm text-gray-600">{activity.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{activity.timestamp}</div>
                      {activity.xp && (
                        <div className="text-sm font-medium text-green-600">+{activity.xp} XP</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Stats & Social */}
        <div className="space-y-6">
          {/* Streak & XP */}
          <StreakCounter 
            className=""
            showCalendar={true}
            showFreezeOption={true}
          />

          <XPLevelSystem 
            className=""
            showDailyGoals={false}
            showWeeklyChallenges={true}
          />

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Lessons</span>
                  </div>
                  <span className="font-semibold">{dashboardData.stats.totalLessons}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Time Spent</span>
                  </div>
                  <span className="font-semibold">{dashboardData.stats.timeSpent}h</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">This Week</span>
                  </div>
                  <span className="font-semibold">{dashboardData.stats.weeklyXP} XP</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Friends Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Friends Activity</h3>
              </div>
              
              <div className="space-y-3">
                {dashboardData.friendsActivity.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {friend.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {friend.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {friend.action}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{friend.timestamp}</div>
                      {friend.xp && (
                        <div className="text-xs text-green-600">+{friend.xp} XP</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Friends
              </Button>
            </Card>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
              </div>
              
              <div className="space-y-3">
                {dashboardData.recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Achievements
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
