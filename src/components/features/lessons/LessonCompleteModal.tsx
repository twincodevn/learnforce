'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Zap, 
  Clock,
  Target,
  Award,
  ChevronRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface LessonResult {
  score: number;
  xpEarned: number;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
  newAchievements?: Achievement[];
  leveledUp?: boolean;
  newLevel?: number;
  streak?: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LessonCompleteModalProps {
  result: LessonResult;
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
}

export const LessonCompleteModal: React.FC<LessonCompleteModalProps> = ({
  result,
  isOpen,
  onClose,
  onContinue,
}) => {
  const [step, setStep] = useState(0);
  const [animatedXP, setAnimatedXP] = useState(0);

  const accuracy = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const timeMinutes = Math.floor(result.timeSpent / 60);
  const timeSeconds = result.timeSpent % 60;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "Perfect!", color: "text-green-600", icon: Trophy };
    if (accuracy >= 80) return { message: "Excellent!", color: "text-blue-600", icon: Star };
    if (accuracy >= 70) return { message: "Great job!", color: "text-purple-600", icon: Target };
    if (accuracy >= 60) return { message: "Good work!", color: "text-orange-600", icon: TrendingUp };
    return { message: "Keep practicing!", color: "text-gray-600", icon: Target };
  };

  const performance = getPerformanceMessage();

  useEffect(() => {
    if (isOpen && step === 0) {
      // Start XP animation
      const duration = 2000; // 2 seconds
      const steps = 50;
      const increment = result.xpEarned / steps;
      
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= result.xpEarned) {
          setAnimatedXP(result.xpEarned);
          clearInterval(timer);
          // Move to next step after XP animation
          setTimeout(() => setStep(1), 500);
        } else {
          setAnimatedXP(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isOpen, step, result.xpEarned]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Celebration Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 opacity-10" />
          
          {/* Content */}
          <div className="relative p-6">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="xp-animation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-6"
                >
                  {/* Main celebration */}
                  <div className="space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", damping: 20 }}
                      className={cn("mx-auto w-20 h-20 rounded-full flex items-center justify-center", 
                        accuracy >= 80 ? "bg-green-100" : "bg-blue-100"
                      )}
                    >
                      <performance.icon 
                        className={cn("w-10 h-10", performance.color)} 
                      />
                    </motion.div>
                    
                    <div>
                      <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-bold text-gray-900"
                      >
                        Lesson Complete!
                      </motion.h2>
                      
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className={cn("text-lg font-semibold", performance.color)}
                      >
                        {performance.message}
                      </motion.p>
                    </div>
                  </div>

                  {/* XP Display */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <Zap className="w-8 h-8" />
                      <div>
                        <p className="text-sm opacity-90">XP Earned</p>
                        <p className="text-3xl font-bold">
                          +{Math.floor(animatedXP)}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-1"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Target className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{accuracy}%</p>
                      <p className="text-xs text-gray-500">Accuracy</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="space-y-1"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {timeMinutes}:{timeSeconds.toString().padStart(2, '0')}
                      </p>
                      <p className="text-xs text-gray-500">Time</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                      className="space-y-1"
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <Star className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {result.correctAnswers}/{result.totalQuestions}
                      </p>
                      <p className="text-xs text-gray-500">Correct</p>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Level Up */}
                  {result.leveledUp && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white text-center"
                    >
                      <Sparkles className="w-12 h-12 mx-auto mb-2" />
                      <h3 className="text-xl font-bold">Level Up!</h3>
                      <p className="text-lg">You reached level {result.newLevel}</p>
                    </motion.div>
                  )}

                  {/* Streak */}
                  {result.streak && result.streak > 1 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-4 text-white text-center"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Zap className="w-6 h-6" />
                        <span className="text-lg font-semibold">{result.streak} Day Streak!</span>
                      </div>
                    </motion.div>
                  )}

                  {/* New Achievements */}
                  {result.newAchievements && result.newAchievements.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 text-center">
                        New Achievements!
                      </h3>
                      
                      {result.newAchievements.map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className={cn(
                            "p-4 rounded-xl border-l-4 border-yellow-400",
                            getRarityColor(achievement.rarity)
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                              <Award className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{achievement.name}</h4>
                              <p className="text-sm opacity-75">{achievement.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={onContinue || onClose}
                    >
                      Continue Learning
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={onClose}
                    >
                      Return to Dashboard
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};