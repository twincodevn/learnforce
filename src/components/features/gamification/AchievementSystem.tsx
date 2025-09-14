'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  BookOpen, 
  Users, 
  Zap, 
  Crown,
  Lock,
  CheckCircle,
  Share2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'xp' | 'lessons' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
  gradient: string;
}

interface AchievementSystemProps {
  className?: string;
  showCategories?: boolean;
  showProgress?: boolean;
  onAchievementUnlock?: (achievement: Achievement) => void;
}

const ACHIEVEMENTS: Achievement[] = [
  // Streak Achievements
  {
    id: 'first_streak',
    title: 'Getting Started',
    description: 'Complete your first 3-day streak',
    icon: 'flame',
    category: 'streak',
    rarity: 'common',
    xpReward: 50,
    isUnlocked: true,
    progress: 3,
    maxProgress: 3,
    unlockedAt: '2024-01-15',
    gradient: 'from-orange-400 to-red-500'
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'flame',
    category: 'streak',
    rarity: 'common',
    xpReward: 100,
    isUnlocked: true,
    progress: 7,
    maxProgress: 7,
    unlockedAt: '2024-01-20',
    gradient: 'from-orange-400 to-red-500'
  },
  {
    id: 'month_master',
    title: 'Month Master',
    description: 'Achieve a 30-day streak',
    icon: 'flame',
    category: 'streak',
    rarity: 'rare',
    xpReward: 500,
    isUnlocked: false,
    progress: 7,
    maxProgress: 30,
    gradient: 'from-orange-400 to-red-500'
  },
  {
    id: 'streak_legend',
    title: 'Streak Legend',
    description: 'Maintain a 100-day streak',
    icon: 'crown',
    category: 'streak',
    rarity: 'legendary',
    xpReward: 2000,
    isUnlocked: false,
    progress: 7,
    maxProgress: 100,
    gradient: 'from-purple-500 to-pink-500'
  },

  // XP Achievements
  {
    id: 'xp_beginner',
    title: 'XP Collector',
    description: 'Earn your first 100 XP',
    icon: 'star',
    category: 'xp',
    rarity: 'common',
    xpReward: 25,
    isUnlocked: true,
    progress: 100,
    maxProgress: 100,
    unlockedAt: '2024-01-10',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'xp_explorer',
    title: 'XP Explorer',
    description: 'Accumulate 1,000 total XP',
    icon: 'star',
    category: 'xp',
    rarity: 'common',
    xpReward: 100,
    isUnlocked: true,
    progress: 1000,
    maxProgress: 1000,
    unlockedAt: '2024-01-25',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'xp_master',
    title: 'XP Master',
    description: 'Reach 10,000 total XP',
    icon: 'trophy',
    category: 'xp',
    rarity: 'epic',
    xpReward: 1000,
    isUnlocked: false,
    progress: 1250,
    maxProgress: 10000,
    gradient: 'from-blue-500 to-purple-600'
  },

  // Lesson Achievements
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'book',
    category: 'lessons',
    rarity: 'common',
    xpReward: 25,
    isUnlocked: true,
    progress: 1,
    maxProgress: 1,
    unlockedAt: '2024-01-05',
    gradient: 'from-green-400 to-blue-500'
  },
  {
    id: 'lesson_learner',
    title: 'Lesson Learner',
    description: 'Complete 50 lessons',
    icon: 'book',
    category: 'lessons',
    rarity: 'common',
    xpReward: 200,
    isUnlocked: false,
    progress: 15,
    maxProgress: 50,
    gradient: 'from-green-400 to-blue-500'
  },
  {
    id: 'knowledge_seeker',
    title: 'Knowledge Seeker',
    description: 'Complete 200 lessons',
    icon: 'book',
    category: 'lessons',
    rarity: 'rare',
    xpReward: 750,
    isUnlocked: false,
    progress: 15,
    maxProgress: 200,
    gradient: 'from-green-400 to-blue-500'
  },

  // Social Achievements
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Add 5 friends',
    icon: 'users',
    category: 'social',
    rarity: 'common',
    xpReward: 100,
    isUnlocked: false,
    progress: 2,
    maxProgress: 5,
    gradient: 'from-pink-400 to-purple-500'
  },
  {
    id: 'community_champion',
    title: 'Community Champion',
    description: 'Help 10 friends with challenges',
    icon: 'users',
    category: 'social',
    rarity: 'rare',
    xpReward: 500,
    isUnlocked: false,
    progress: 0,
    maxProgress: 10,
    gradient: 'from-pink-400 to-purple-500'
  },

  // Special Achievements
  {
    id: 'perfect_week',
    title: 'Perfect Week',
    description: 'Complete all daily goals for 7 days',
    icon: 'target',
    category: 'special',
    rarity: 'epic',
    xpReward: 1000,
    isUnlocked: false,
    progress: 3,
    maxProgress: 7,
    gradient: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete lessons before 8 AM for 5 days',
    icon: 'zap',
    category: 'special',
    rarity: 'rare',
    xpReward: 300,
    isUnlocked: false,
    progress: 1,
    maxProgress: 5,
    gradient: 'from-yellow-400 to-orange-500'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'trophy', count: ACHIEVEMENTS.length },
  { id: 'streak', name: 'Streaks', icon: 'flame', count: ACHIEVEMENTS.filter(a => a.category === 'streak').length },
  { id: 'xp', name: 'XP', icon: 'star', count: ACHIEVEMENTS.filter(a => a.category === 'xp').length },
  { id: 'lessons', name: 'Lessons', icon: 'book', count: ACHIEVEMENTS.filter(a => a.category === 'lessons').length },
  { id: 'social', name: 'Social', icon: 'users', count: ACHIEVEMENTS.filter(a => a.category === 'social').length },
  { id: 'special', name: 'Special', icon: 'crown', count: ACHIEVEMENTS.filter(a => a.category === 'special').length },
];

const RARITY_COLORS = {
  common: 'text-gray-600 bg-gray-100',
  rare: 'text-blue-600 bg-blue-100',
  epic: 'text-purple-600 bg-purple-100',
  legendary: 'text-yellow-600 bg-yellow-100'
};

const RARITY_GRADIENTS = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500'
};

export function AchievementSystem({ 
  className = '', 
  showCategories = true,
  showProgress = true,
  onAchievementUnlock 
}: AchievementSystemProps) {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAchievements(ACHIEVEMENTS);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, [user?.id]);

  const getIcon = (iconName: string) => {
    const icons = {
      trophy: Trophy,
      star: Star,
      flame: Flame,
      target: Target,
      book: BookOpen,
      users: Users,
      zap: Zap,
      crown: Crown
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Trophy;
    return <IconComponent className="w-6 h-6" />;
  };

  const getCategoryIcon = (iconName: string) => {
    const icons = {
      trophy: Trophy,
      flame: Flame,
      star: Star,
      book: BookOpen,
      users: Users,
      crown: Crown
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Trophy;
    return <IconComponent className="w-4 h-4" />;
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  const handleAchievementClick = (achievement: Achievement) => {
    if (achievement.isUnlocked) {
      // Show achievement details or share
      return;
    }
    
    // Simulate unlocking achievement (for demo)
    if (achievement.progress >= achievement.maxProgress) {
      const updatedAchievement = { ...achievement, isUnlocked: true, unlockedAt: new Date().toISOString() };
      setUnlockedAchievement(updatedAchievement);
      setShowUnlockModal(true);
      onAchievementUnlock?.(updatedAchievement);
    }
  };

  const handleShareAchievement = (achievement: Achievement) => {
    if (navigator.share) {
      navigator.share({
        title: `I just unlocked "${achievement.title}" on LearnForce!`,
        text: achievement.description,
        url: window.location.origin
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`I just unlocked "${achievement.title}" on LearnForce! ${achievement.description}`);
    }
  };

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
          <p className="text-gray-600">
            {unlockedCount} of {totalCount} unlocked
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{unlockedCount}</div>
          <div className="text-sm text-gray-500">Unlocked</div>
        </div>
      </div>

      {/* Categories */}
      {showCategories && (
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              {getCategoryIcon(category.icon)}
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      )}

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`p-4 cursor-pointer transition-all duration-200 ${
                achievement.isUnlocked 
                  ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200 hover:shadow-lg' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => handleAchievementClick(achievement)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${
                  achievement.isUnlocked 
                    ? `bg-gradient-to-r ${achievement.gradient} text-white` 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {achievement.isUnlocked ? getIcon(achievement.icon) : <Lock className="w-6 h-6" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {achievement.title}
                    </h3>
                    {achievement.isUnlocked && (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {achievement.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      RARITY_COLORS[achievement.rarity]
                    }`}>
                      {achievement.rarity.toUpperCase()}
                    </span>
                    
                    <span className="text-sm font-medium text-green-600">
                      +{achievement.xpReward} XP
                    </span>
                  </div>
                  
                  {showProgress && !achievement.isUnlocked && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress} / {achievement.maxProgress}</span>
                      </div>
                      <ProgressBar 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-1"
                      />
                    </div>
                  )}
                  
                  {achievement.isUnlocked && achievement.unlockedAt && (
                    <div className="mt-2 text-xs text-gray-500">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              
              {achievement.isUnlocked && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareAchievement(achievement);
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Achievement
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievement Unlock Modal */}
      <AnimatePresence>
        {showUnlockModal && unlockedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowUnlockModal(false)}
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
                className={`w-20 h-20 bg-gradient-to-r ${unlockedAchievement.gradient} rounded-full flex items-center justify-center mx-auto mb-6`}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Achievement Unlocked!
              </h2>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {unlockedAchievement.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {unlockedAchievement.description}
              </p>
              <div className="text-lg font-bold text-green-600 mb-6">
                +{unlockedAchievement.xpReward} XP
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowUnlockModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Continue
                </Button>
                <Button
                  onClick={() => {
                    handleShareAchievement(unlockedAchievement);
                    setShowUnlockModal(false);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
