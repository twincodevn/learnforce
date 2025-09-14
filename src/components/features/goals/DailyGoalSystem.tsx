'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Clock, 
  Zap, 
  Book, 
  Calendar,
  Award,
  Flame,
  Shield,
  Settings,
  Check,
  TrendingUp,
  Star,
  Trophy,
  ChevronRight,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface DailyGoal {
  id: string;
  type: 'time' | 'lessons' | 'xp';
  target: number;
  current: number;
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface GoalStats {
  streak: number;
  longestStreak: number;
  goalsMet: number;
  totalDays: number;
  weeklyCompletion: number[];
  monthlyStats: {
    completed: number;
    total: number;
    percentage: number;
  };
}

interface Reward {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  claimed: boolean;
  condition: string;
}

interface DailyGoalSystemProps {
  onUpdateGoal: (goalId: string, newTarget: number) => void;
  onClaimReward: (rewardId: string) => void;
  onUseStreakFreeze: () => void;
}

export const DailyGoalSystem: React.FC<DailyGoalSystemProps> = ({
  onUpdateGoal,
  onClaimReward,
  onUseStreakFreeze,
}) => {
  const [goals, setGoals] = useState<DailyGoal[]>([
    {
      id: 'time',
      type: 'time',
      target: 15,
      current: 12,
      unit: 'minutes',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'lessons',
      type: 'lessons',
      target: 3,
      current: 2,
      unit: 'lessons',
      icon: Book,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 'xp',
      type: 'xp',
      target: 50,
      current: 35,
      unit: 'XP',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]);

  const [stats, setStats] = useState<GoalStats>({
    streak: 7,
    longestStreak: 23,
    goalsMet: 85,
    totalDays: 100,
    weeklyCompletion: [1, 1, 0, 1, 1, 1, 0], // Last 7 days (0 = missed, 1 = completed)
    monthlyStats: {
      completed: 26,
      total: 30,
      percentage: 87,
    },
  });

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      name: '7-Day Streak',
      description: 'Complete goals for 7 days in a row',
      icon: Flame,
      claimed: false,
      condition: 'streak >= 7',
    },
    {
      id: '2',
      name: 'Goal Master',
      description: 'Meet all daily goals 10 times',
      icon: Target,
      claimed: true,
      condition: 'perfectDays >= 10',
    },
    {
      id: '3',
      name: 'Consistency Champion',
      description: 'Maintain a streak for 30 days',
      icon: Trophy,
      claimed: false,
      condition: 'longestStreak >= 30',
    },
  ]);

  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [tempTarget, setTempTarget] = useState<number>(0);
  const [showSettings, setShowSettings] = useState(false);
  const [streakFreezes, setStreakFreezes] = useState(2);
  const [showCelebration, setShowCelebration] = useState(false);

  // Check if all goals are completed
  const allGoalsCompleted = goals.every(goal => goal.current >= goal.target);
  const completionPercentage = Math.round(
    (goals.reduce((sum, goal) => sum + Math.min(goal.current / goal.target, 1), 0) / goals.length) * 100
  );

  const handleEditGoal = (goalId: string, currentTarget: number) => {
    setEditingGoal(goalId);
    setTempTarget(currentTarget);
  };

  const handleSaveGoal = () => {
    if (editingGoal && tempTarget > 0) {
      setGoals(prev => 
        prev.map(goal => 
          goal.id === editingGoal 
            ? { ...goal, target: tempTarget }
            : goal
        )
      );
      onUpdateGoal(editingGoal, tempTarget);
    }
    setEditingGoal(null);
  };

  const getDayOfWeek = (index: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const dayIndex = (today - 6 + index) % 7;
    return days[dayIndex < 0 ? dayIndex + 7 : dayIndex];
  };

  const GoalCard: React.FC<{ goal: DailyGoal }> = ({ goal }) => {
    const progress = Math.min((goal.current / goal.target) * 100, 100);
    const isCompleted = goal.current >= goal.target;
    const IconComponent = goal.icon;

    return (
      <motion.div
        layout
        className={cn(
          'p-6 rounded-2xl border-2 transition-all duration-300',
          isCompleted 
            ? 'border-green-200 bg-green-50' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn('p-3 rounded-xl', goal.bgColor)}>
              <IconComponent className={cn('w-6 h-6', goal.color)} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">{goal.type}</h3>
              <p className="text-sm text-gray-500">Daily target</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-1 rounded-full bg-green-500"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditGoal(goal.id, goal.target)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {editingGoal === goal.id ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={tempTarget}
                  onChange={(e) => setTempTarget(parseInt(e.target.value) || 0)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="1000"
                />
                <span className="text-sm text-gray-500">{goal.unit}</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="primary" size="sm" onClick={handleSaveGoal}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingGoal(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {goal.current}
                </span>
                <span className="text-sm text-gray-500">
                  / {goal.target} {goal.unit}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className={cn(
                      'h-3 rounded-full transition-all duration-500',
                      isCompleted ? 'bg-green-500' : goal.color.replace('text-', 'bg-')
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{Math.round(progress)}% complete</span>
                  {!isCompleted && (
                    <span>{goal.target - goal.current} {goal.unit} to go</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Daily Goals</h1>
        <p className="text-gray-600">Stay consistent with your learning</p>
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'p-6 rounded-2xl text-white relative overflow-hidden',
          allGoalsCompleted 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
            : 'bg-gradient-to-r from-blue-500 to-purple-600'
        )}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {allGoalsCompleted ? 'All Goals Complete!' : "Today's Progress"}
            </h2>
            <p className="opacity-90">
              {allGoalsCompleted 
                ? 'Amazing work! Come back tomorrow for new challenges.'
                : `${completionPercentage}% of your daily goals completed`
              }
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold">{completionPercentage}%</div>
            <div className="text-sm opacity-90">Complete</div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full" />
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white opacity-5 rounded-full" />
      </motion.div>

      {/* Goals Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {/* Streak & Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border-2 border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-orange-100">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Goal Streak</h3>
                <p className="text-sm text-gray-500">Days in a row</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-600">{stats.streak}</div>
                <div className="text-sm text-gray-500">Current streak</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{stats.longestStreak}</div>
                <div className="text-sm text-gray-500">Best streak</div>
              </div>
            </div>

            {/* Weekly view */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">This week</div>
              <div className="flex justify-between">
                {stats.weeklyCompletion.map((completed, index) => (
                  <div key={index} className="text-center">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
                      completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    )}>
                      {completed ? '✓' : '○'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getDayOfWeek(index)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak Freeze */}
            {streakFreezes > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Streak Freeze</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{streakFreezes} left</span>
                    <Button variant="outline" size="sm" onClick={onUseStreakFreeze}>
                      Use
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Protect your streak if you miss a day
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Monthly Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border-2 border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-purple-100">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">This Month</h3>
                <p className="text-sm text-gray-500">Goal completion</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">
                {stats.monthlyStats.percentage}%
              </div>
              <div className="text-sm text-gray-500">
                {stats.monthlyStats.completed} of {stats.monthlyStats.total} days
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.monthlyStats.percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Goals met: {stats.goalsMet}</span>
                <span>Total days: {stats.totalDays}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rewards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border-2 border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-yellow-100">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Goal Rewards</h3>
              <p className="text-sm text-gray-500">Unlock achievements by meeting goals</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className={cn(
                'p-4 rounded-xl border-2 transition-all duration-200',
                reward.claimed
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <div className="flex items-start space-x-3">
                <div className={cn(
                  'p-2 rounded-lg',
                  reward.claimed ? 'bg-green-100' : 'bg-gray-100'
                )}>
                  <reward.icon className={cn(
                    'w-5 h-5',
                    reward.claimed ? 'text-green-600' : 'text-gray-600'
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                  
                  {reward.claimed ? (
                    <div className="mt-2 inline-flex items-center text-xs text-green-600 font-medium">
                      <Check className="w-3 h-3 mr-1" />
                      Claimed
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => onClaimReward(reward.id)}
                    >
                      Claim
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && allGoalsCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 text-center max-w-sm w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Trophy className="w-10 h-10 text-green-600" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Goals Complete!
              </h2>
              
              <p className="text-gray-600 mb-6">
                You've achieved all your daily goals. Keep up the amazing work!
              </p>
              
              <Button
                variant="primary"
                fullWidth
                onClick={() => setShowCelebration(false)}
              >
                Continue Learning
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};