export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  image?: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveAt?: Date;
  totalLessons: number;
  totalTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  content: string; // JSON string that needs to be parsed
  order: number;
  xpReward: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonContent {
  type: 'multiple_choice' | 'fill_blank' | 'translation' | 'listening' | 'speaking';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  hints?: string[];
}

export interface UserProgress {
  id: string;
  userId: string;
  subjectId: string;
  lessonId?: string;
  completed: boolean;
  score?: number;
  timeSpent?: number;
  xpEarned: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  category: 'streak' | 'xp' | 'lessons' | 'time' | 'special';
  requirement: number;
  xpReward: number;
  isActive: boolean;
  createdAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  achievement: Achievement;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  xp: number;
  level: number;
  streak: number;
  rank: number;
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  user: Pick<User, 'username' | 'name' | 'image'>;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameStats {
  totalXp: number;
  currentLevel: number;
  xpToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalLessons: number;
  totalTime: number;
  achievements: UserAchievement[];
  weeklyXp: number;
  monthlyXp: number;
}

export interface LessonResult {
  score: number;
  xpEarned: number;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
  achievements?: Achievement[];
}

export interface StreakData {
  current: number;
  longest: number;
  lastActiveDate?: Date;
  isActive: boolean;
}

export interface LevelData {
  current: number;
  xp: number;
  xpToNext: number;
  progress: number; // 0-100
}
