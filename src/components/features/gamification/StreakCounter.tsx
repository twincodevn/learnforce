'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Calendar, Shield, Zap, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  streakFreezes: number;
  weeklyStreaks: { date: string; completed: boolean }[];
}

interface StreakCounterProps {
  className?: string;
  showCalendar?: boolean;
  showFreezeOption?: boolean;
  onStreakIncrease?: (newStreak: number) => void;
}

export function StreakCounter({ 
  className = '', 
  showCalendar = true, 
  showFreezeOption = true,
  onStreakIncrease 
}: StreakCounterProps) {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    streakFreezes: 0,
    weeklyStreaks: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Mock data for now - replace with actual API call
  useEffect(() => {
    const fetchStreakData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: StreakData = {
          currentStreak: 7,
          longestStreak: 15,
          lastActiveDate: new Date().toISOString(),
          streakFreezes: 2,
          weeklyStreaks: generateWeeklyStreaks()
        };
        
        setStreakData(mockData);
      } catch (error) {
        console.error('Error fetching streak data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreakData();
  }, [user?.id]);

  const generateWeeklyStreaks = () => {
    const streaks = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      streaks.push({
        date: date.toISOString(),
        completed: i <= 2 // Mock: last 3 days completed
      });
    }
    
    return streaks;
  };

  const handleStreakIncrease = () => {
    setIsAnimating(true);
    setStreakData(prev => ({
      ...prev,
      currentStreak: prev.currentStreak + 1
    }));
    
    onStreakIncrease?.(streakData.currentStreak + 1);
    
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const handleFreezeStreak = async () => {
    if (streakData.streakFreezes <= 0) return;
    
    try {
      // API call to freeze streak
      setStreakData(prev => ({
        ...prev,
        streakFreezes: prev.streakFreezes - 1
      }));
      setShowFreezeModal(false);
    } catch (error) {
      console.error('Error freezing streak:', error);
    }
  };

  const getStreakMessage = () => {
    const streak = streakData.currentStreak;
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "Great start! Keep it going!";
    if (streak < 7) return "You're on fire! 🔥";
    if (streak < 30) return "Incredible streak!";
    if (streak < 100) return "You're a streak master!";
    return "Legendary streak! 🏆";
  };

  const getStreakWarning = () => {
    const lastActive = new Date(streakData.lastActiveDate);
    const hoursSinceLastActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastActive > 20 && hoursSinceLastActive < 24) {
      return "⚠️ Your streak will break in a few hours!";
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Streak Display */}
      <Card className="p-6 bg-gradient-to-r from-orange-400 to-red-500 text-white">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={isAnimating ? { 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Flame className="w-8 h-8" />
            <span className="text-4xl font-bold">{streakData.currentStreak}</span>
            <Flame className="w-8 h-8" />
          </motion.div>
          
          <p className="text-lg font-medium mb-2">Day Streak</p>
          <p className="text-sm opacity-90">{getStreakMessage()}</p>
          
          {getStreakWarning() && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-2 bg-yellow-500/20 rounded-lg border border-yellow-300/30"
            >
              <p className="text-sm font-medium">{getStreakWarning()}</p>
            </motion.div>
          )}
        </motion.div>
      </Card>

      {/* Streak Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{streakData.longestStreak}</div>
          <div className="text-sm text-gray-600">Longest Streak</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{streakData.streakFreezes}</div>
          <div className="text-sm text-gray-600">Freezes Left</div>
        </Card>
      </div>

      {/* Weekly Calendar */}
      {showCalendar && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">This Week</h3>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {streakData.weeklyStreaks.map((day, index) => {
              const date = new Date(day.date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                    day.completed
                      ? 'bg-green-500 text-white'
                      : isToday
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {date.getDate()}
                </motion.div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Streak Freeze Option */}
      {showFreezeOption && streakData.streakFreezes > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">Protect Your Streak</h3>
                <p className="text-sm text-gray-600">Use a freeze to save your streak</p>
              </div>
            </div>
            
            <Button
              onClick={() => setShowFreezeModal(true)}
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Shield className="w-4 h-4 mr-2" />
              Freeze
            </Button>
          </div>
        </Card>
      )}

      {/* Test Button for Demo */}
      <Button
        onClick={handleStreakIncrease}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        <Zap className="w-4 h-4 mr-2" />
        Complete Lesson (Demo)
      </Button>

      {/* Freeze Modal */}
      <AnimatePresence>
        {showFreezeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowFreezeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Freeze Your Streak?
                </h3>
                <p className="text-gray-600 mb-6">
                  This will use one of your {streakData.streakFreezes} streak freezes to protect your current streak of {streakData.currentStreak} days.
                </p>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowFreezeModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFreezeStreak}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Freeze Streak
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
