'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Zap, Target, Award, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';

interface XPData {
  currentXP: number;
  level: number;
  xpToNextLevel: number;
  totalXP: number;
  dailyGoal: number;
  weeklyXP: number;
  monthlyXP: number;
  xpMultiplier: number;
  levelTitle: string;
  levelColor: string;
}

interface XPLevelSystemProps {
  className?: string;
  showDailyGoals?: boolean;
  showWeeklyChallenges?: boolean;
  onXPGain?: (xp: number, totalXP: number) => void;
  onLevelUp?: (newLevel: number) => void;
}

const LEVELS = [
  { level: 1, title: 'Beginner', color: '#8B4513', xpRequired: 0 },
  { level: 2, title: 'Novice', color: '#CD7F32', xpRequired: 100 },
  { level: 3, title: 'Apprentice', color: '#C0C0C0', xpRequired: 250 },
  { level: 4, title: 'Bronze', color: '#CD7F32', xpRequired: 500 },
  { level: 5, title: 'Silver', color: '#C0C0C0', xpRequired: 1000 },
  { level: 6, title: 'Gold', color: '#FFD700', xpRequired: 2000 },
  { level: 7, title: 'Platinum', color: '#E5E4E2', xpRequired: 4000 },
  { level: 8, title: 'Diamond', color: '#B9F2FF', xpRequired: 8000 },
  { level: 9, title: 'Master', color: '#800080', xpRequired: 15000 },
  { level: 10, title: 'Legend', color: '#FF6B6B', xpRequired: 30000 },
];

const DAILY_GOALS = [
  { id: 'basic', name: 'Basic', xp: 10, color: '#10B981' },
  { id: 'regular', name: 'Regular', xp: 20, color: '#3B82F6' },
  { id: 'serious', name: 'Serious', xp: 30, color: '#8B5CF6' },
  { id: 'intense', name: 'Intense', xp: 50, color: '#EF4444' },
];

export function XPLevelSystem({ 
  className = '', 
  showDailyGoals = true, 
  showWeeklyChallenges = true,
  onXPGain,
  onLevelUp 
}: XPLevelSystemProps) {
  const { user } = useAuth();
  const [xpData, setXpData] = useState<XPData>({
    currentXP: 0,
    level: 1,
    xpToNextLevel: 100,
    totalXP: 0,
    dailyGoal: 20,
    weeklyXP: 0,
    monthlyXP: 0,
    xpMultiplier: 1,
    levelTitle: 'Beginner',
    levelColor: '#8B4513'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [xpGainAnimation, setXpGainAnimation] = useState<{ xp: number; x: number; y: number } | null>(null);

  // Mock data for now - replace with actual API call
  useEffect(() => {
    const fetchXPData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: XPData = {
          currentXP: 750,
          level: 4,
          xpToNextLevel: 250,
          totalXP: 1250,
          dailyGoal: 20,
          weeklyXP: 140,
          monthlyXP: 600,
          xpMultiplier: 1.5,
          levelTitle: 'Bronze',
          levelColor: '#CD7F32'
        };
        
        setXpData(mockData);
      } catch (error) {
        console.error('Error fetching XP data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchXPData();
  }, [user?.id]);

  const getCurrentLevel = (xp: number) => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].xpRequired) {
        return LEVELS[i];
      }
    }
    return LEVELS[0];
  };

  const getNextLevel = (currentLevel: number) => {
    return LEVELS.find(level => level.level === currentLevel + 1) || LEVELS[LEVELS.length - 1];
  };

  const calculateXPToNextLevel = (currentXP: number, currentLevel: number) => {
    const nextLevel = getNextLevel(currentLevel);
    return nextLevel ? nextLevel.xpRequired - currentXP : 0;
  };

  const handleXPGain = (xp: number, position?: { x: number; y: number }) => {
    const newTotalXP = xpData.totalXP + xp;
    const newCurrentXP = xpData.currentXP + xp;
    const currentLevelData = getCurrentLevel(newTotalXP);
    const nextLevelData = getNextLevel(currentLevelData.level);
    
    let newLevel = currentLevelData.level;
    let newCurrentXPForLevel = newCurrentXP;
    
    // Check for level up
    if (currentLevelData.level > xpData.level) {
      newLevel = currentLevelData.level;
      newCurrentXPForLevel = newTotalXP - currentLevelData.xpRequired;
      setNewLevel(newLevel);
      setShowLevelUpModal(true);
      onLevelUp?.(newLevel);
    }
    
    const newXpToNextLevel = nextLevelData ? nextLevelData.xpRequired - newTotalXP : 0;
    
    setXpData(prev => ({
      ...prev,
      currentXP: newCurrentXPForLevel,
      level: newLevel,
      xpToNextLevel: newXpToNextLevel,
      totalXP: newTotalXP,
      levelTitle: currentLevelData.title,
      levelColor: currentLevelData.color
    }));

    // XP gain animation
    if (position) {
      setXpGainAnimation({ xp, x: position.x, y: position.y });
      setTimeout(() => setXpGainAnimation(null), 2000);
    }

    onXPGain?.(xp, newTotalXP);
  };

  const handleDailyGoalChange = (goalId: string) => {
    const goal = DAILY_GOALS.find(g => g.id === goalId);
    if (goal) {
      setXpData(prev => ({ ...prev, dailyGoal: goal.xp }));
    }
  };

  const getLevelIcon = (level: number) => {
    if (level >= 10) return <Crown className="w-6 h-6" />;
    if (level >= 7) return <Award className="w-6 h-6" />;
    if (level >= 4) return <Trophy className="w-6 h-6" />;
    return <Star className="w-6 h-6" />;
  };

  const getProgressPercentage = () => {
    const currentLevelData = getCurrentLevel(xpData.totalXP);
    const nextLevelData = getNextLevel(currentLevelData.level);
    
    if (!nextLevelData) return 100;
    
    const levelStartXP = currentLevelData.xpRequired;
    const levelEndXP = nextLevelData.xpRequired;
    const levelProgress = xpData.totalXP - levelStartXP;
    const levelTotal = levelEndXP - levelStartXP;
    
    return Math.min((levelProgress / levelTotal) * 100, 100);
  };

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main XP Display */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={isAnimating ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ duration: 0.6 }}
              style={{ color: xpData.levelColor }}
            >
              {getLevelIcon(xpData.level)}
            </motion.div>
            <div>
              <div className="text-3xl font-bold">Level {xpData.level}</div>
              <div className="text-lg opacity-90">{xpData.levelTitle}</div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>{xpData.currentXP} XP</span>
              <span>{xpData.xpToNextLevel} to next level</span>
            </div>
            <ProgressBar 
              value={getProgressPercentage()} 
              className="h-3 bg-white/20"
              fillClassName="bg-white"
            />
          </div>
          
          <div className="text-sm opacity-90">
            Total: {xpData.totalXP.toLocaleString()} XP
          </div>
        </motion.div>
      </Card>

      {/* XP Multiplier */}
      {xpData.xpMultiplier > 1 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-yellow-600" />
            <div>
              <div className="font-medium text-yellow-800">XP Boost Active!</div>
              <div className="text-sm text-yellow-600">
                {xpData.xpMultiplier}x multiplier for perfect lessons
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Daily Goals */}
      {showDailyGoals && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Daily Goal</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Today's Progress</span>
              <span className="text-sm font-medium">
                {Math.min(xpData.weeklyXP, xpData.dailyGoal)} / {xpData.dailyGoal} XP
              </span>
            </div>
            
            <ProgressBar 
              value={(Math.min(xpData.weeklyXP, xpData.dailyGoal) / xpData.dailyGoal) * 100} 
              className="h-2"
            />
            
            <div className="grid grid-cols-2 gap-2">
              {DAILY_GOALS.map((goal) => (
                <Button
                  key={goal.id}
                  onClick={() => handleDailyGoalChange(goal.id)}
                  variant={xpData.dailyGoal === goal.xp ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${
                    xpData.dailyGoal === goal.xp 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'border-gray-300'
                  }`}
                >
                  {goal.name} ({goal.xp} XP)
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Weekly Challenges */}
      {showWeeklyChallenges && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Weekly Challenge</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="text-sm font-medium">{xpData.weeklyXP} / 100 XP</span>
            </div>
            
            <ProgressBar 
              value={(xpData.weeklyXP / 100) * 100} 
              className="h-2"
            />
            
            <div className="text-xs text-gray-500">
              Complete 100 XP this week to earn bonus rewards!
            </div>
          </div>
        </Card>
      )}

      {/* Test Button for Demo */}
      <Button
        onClick={() => handleXPGain(25, { x: 200, y: 100 })}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        <Zap className="w-4 h-4 mr-2" />
        Complete Lesson (+25 XP)
      </Button>

      {/* XP Gain Animation */}
      <AnimatePresence>
        {xpGainAnimation && (
          <motion.div
            initial={{ 
              opacity: 1, 
              x: xpGainAnimation.x, 
              y: xpGainAnimation.y,
              scale: 0.5
            }}
            animate={{ 
              opacity: 0, 
              y: xpGainAnimation.y - 50,
              scale: 1.2
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="fixed pointer-events-none z-50"
            style={{ left: xpGainAnimation.x, top: xpGainAnimation.y }}
          >
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              +{xpGainAnimation.xp} XP
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowLevelUpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                {getLevelIcon(newLevel)}
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Level Up!
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                You've reached Level {newLevel}!
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Keep learning to unlock new achievements and rewards!
              </p>
              
              <Button
                onClick={() => setShowLevelUpModal(false)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Continue Learning
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
