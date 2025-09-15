'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Zap, 
  BookOpen,
  Award,
  Calendar,
  Filter,
  Download,
  Share2,
  Eye,
  ChevronDown,
  ChevronUp,
  Activity,
  Brain,
  CheckCircle,
  AlertCircle,
  Star,
  Trophy,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface ProgressData {
  date: string;
  xp: number;
  lessonsCompleted: number;
  timeSpent: number;
  accuracy: number;
  streak: number;
}

interface SubjectProgress {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalLessons: number;
  completedLessons: number;
  totalXP: number;
  earnedXP: number;
  averageAccuracy: number;
  timeSpent: number;
  lastActivity: Date;
  strengths: string[];
  weaknesses: string[];
  nextRecommended: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LearningInsight {
  type: 'strength' | 'weakness' | 'recommendation' | 'milestone';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ComponentType<any>;
  color: string;
}

interface ProgressTrackerProps {
  currentUser: {
    id: string;
    username: string;
    level: number;
    xp: number;
    streak: number;
  };
  onExportData: () => void;
  onShareProgress: () => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentUser,
  onExportData,
  onShareProgress,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'achievements' | 'insights'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  // Mock data
  useEffect(() => {
    const mockProgressData: ProgressData[] = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      xp: Math.floor(Math.random() * 100) + 20,
      lessonsCompleted: Math.floor(Math.random() * 5) + 1,
      timeSpent: Math.floor(Math.random() * 120) + 30,
      accuracy: Math.floor(Math.random() * 30) + 70,
      streak: Math.floor(Math.random() * 10) + 1,
    }));

    const mockSubjectProgress: SubjectProgress[] = [
      {
        id: '1',
        name: 'JavaScript Fundamentals',
        icon: '💻',
        color: 'bg-yellow-500',
        totalLessons: 45,
        completedLessons: 32,
        totalXP: 2250,
        earnedXP: 1680,
        averageAccuracy: 87,
        timeSpent: 1840,
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        strengths: ['Variables & Functions', 'Arrays & Objects'],
        weaknesses: ['Async Programming', 'Error Handling'],
        nextRecommended: 'Promises and Async/Await',
      },
      {
        id: '2',
        name: 'React Development',
        icon: '⚛️',
        color: 'bg-blue-500',
        totalLessons: 38,
        completedLessons: 15,
        totalXP: 1900,
        earnedXP: 750,
        averageAccuracy: 82,
        timeSpent: 920,
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
        strengths: ['JSX & Components'],
        weaknesses: ['Hooks', 'State Management'],
        nextRecommended: 'useState and useEffect',
      },
    ];

    const mockAchievements: Achievement[] = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        category: 'Getting Started',
        earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        rarity: 'common',
      },
      {
        id: '2',
        name: 'Streak Master',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        category: 'Consistency',
        earnedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        rarity: 'rare',
      },
      {
        id: '3',
        name: 'JavaScript Ninja',
        description: 'Master JavaScript fundamentals',
        icon: '🥷',
        category: 'Subject Mastery',
        earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        rarity: 'epic',
      },
    ];

    const mockInsights: LearningInsight[] = [
      {
        type: 'strength',
        title: 'JavaScript Functions',
        description: 'You excel at function concepts with 95% accuracy',
        priority: 'medium',
        icon: CheckCircle,
        color: 'text-green-600',
      },
      {
        type: 'weakness',
        title: 'Async Programming',
        description: 'Consider reviewing promises and async/await patterns',
        action: 'Practice async exercises',
        priority: 'high',
        icon: AlertCircle,
        color: 'text-red-600',
      },
      {
        type: 'recommendation',
        title: 'React Hooks Deep Dive',
        description: 'Ready for advanced React concepts based on your progress',
        action: 'Start advanced React course',
        priority: 'medium',
        icon: Brain,
        color: 'text-blue-600',
      },
      {
        type: 'milestone',
        title: 'Level 25 Reached!',
        description: 'Congratulations on reaching this learning milestone',
        priority: 'low',
        icon: Trophy,
        color: 'text-yellow-600',
      },
    ];

    setProgressData(mockProgressData);
    setSubjectProgress(mockSubjectProgress);
    setAchievements(mockAchievements);
    setInsights(mockInsights);
  }, []);

  const getTotalStats = () => {
    const totalXP = progressData.reduce((sum, day) => sum + day.xp, 0);
    const totalLessons = progressData.reduce((sum, day) => sum + day.lessonsCompleted, 0);
    const totalTime = progressData.reduce((sum, day) => sum + day.timeSpent, 0);
    const averageAccuracy = Math.round(
      progressData.reduce((sum, day) => sum + day.accuracy, 0) / progressData.length
    );

    return { totalXP, totalLessons, totalTime, averageAccuracy };
  };

  const stats = getTotalStats();

  const SimpleChart: React.FC<{ data: number[]; color: string; label: string }> = ({ data, color, label }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">{label}</div>
        <div className="flex items-end space-x-1 h-20">
          {data.slice(-14).map((value, index) => {
            const height = range > 0 ? ((value - min) / range) * 60 + 10 : 35;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={cn('w-full rounded-t transition-all duration-300', color)}
                  style={{ height: `${height}px` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const StatCard: React.FC<{ 
    title: string; 
    value: string; 
    change: string; 
    icon: React.ComponentType<any>; 
    color: string 
  }> = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-3 rounded-xl', `${color.replace('text-', 'bg-')}-100`)}>
          <Icon className={cn('w-6 h-6', color)} />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{title}</div>
        </div>
      </div>
      <div className="flex items-center text-sm">
        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        <span className="text-green-600">{change}</span>
        <span className="text-gray-500 ml-1">vs last period</span>
      </div>
    </motion.div>
  );

  const SubjectCard: React.FC<{ subject: SubjectProgress }> = ({ subject }) => {
    const progressPercentage = (subject.completedLessons / subject.totalLessons) * 100;
    const xpPercentage = (subject.earnedXP / subject.totalXP) * 100;
    const isExpanded = expandedSubject === subject.id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl', subject.color)}>
              {subject.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{subject.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span>{subject.completedLessons}/{subject.totalLessons} lessons</span>
                <span>{Math.round(progressPercentage)}% complete</span>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Lesson Progress</span>
              <span>{subject.completedLessons}/{subject.totalLessons}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>XP Progress</span>
              <span>{subject.earnedXP}/{subject.totalXP} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-semibold text-gray-900">{subject.averageAccuracy}%</div>
            <div className="text-gray-500">Accuracy</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{Math.round(subject.timeSpent / 60)}h</div>
            <div className="text-gray-500">Time Spent</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {Math.floor((Date.now() - subject.lastActivity.getTime()) / (24 * 60 * 60 * 1000))}d
            </div>
            <div className="text-gray-500">Last Active</div>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200 space-y-4"
            >
              {/* Strengths */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                <div className="flex flex-wrap gap-2">
                  {subject.strengths.map((strength) => (
                    <span
                      key={strength}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                <div className="flex flex-wrap gap-2">
                  {subject.weaknesses.map((weakness) => (
                    <span
                      key={weakness}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      {weakness}
                    </span>
                  ))}
                </div>
              </div>

              {/* Next Recommended */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Recommended Next</h4>
                </div>
                <p className="text-blue-800 text-sm">{subject.nextRecommended}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Tracker</h1>
          <p className="text-gray-600 mt-1">Track your learning journey and insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex bg-white border border-gray-200 rounded-lg p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  timeRange === range
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                )}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>

          <Button variant="outline" onClick={onExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" onClick={onShareProgress}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center justify-center">
        <div className="bg-gray-100 p-1 rounded-xl">
          {(['overview', 'subjects', 'achievements', 'insights'] as const).map((tab) => (
            <button
              key={tab}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize',
                activeTab === tab
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total XP"
                value={stats.totalXP.toLocaleString()}
                change="+12%"
                icon={Zap}
                color="text-orange-600"
              />
              <StatCard
                title="Lessons Completed"
                value={stats.totalLessons.toString()}
                change="+8%"
                icon={BookOpen}
                color="text-green-600"
              />
              <StatCard
                title="Time Spent"
                value={`${Math.round(stats.totalTime / 60)}h`}
                change="+15%"
                icon={Clock}
                color="text-blue-600"
              />
              <StatCard
                title="Average Accuracy"
                value={`${stats.averageAccuracy}%`}
                change="+3%"
                icon={Target}
                color="text-purple-600"
              />
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <SimpleChart
                  data={progressData.map(d => d.xp)}
                  color="bg-orange-500"
                  label="Daily XP Progress"
                />
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <SimpleChart
                  data={progressData.map(d => d.accuracy)}
                  color="bg-green-500"
                  label="Accuracy Trends"
                />
              </div>
            </div>

            {/* Activity Heatmap */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Learning Activity</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Less</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((intensity) => (
                      <div
                        key={intensity}
                        className={cn(
                          'w-3 h-3 rounded-sm',
                          intensity === 1 ? 'bg-gray-200' :
                          intensity === 2 ? 'bg-green-200' :
                          intensity === 3 ? 'bg-green-400' : 'bg-green-600'
                        )}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, i) => {
                  const intensity = Math.floor(Math.random() * 4) + 1;
                  return (
                    <div
                      key={i}
                      className={cn(
                        'w-4 h-4 rounded-sm',
                        intensity === 1 ? 'bg-gray-200' :
                        intensity === 2 ? 'bg-green-200' :
                        intensity === 3 ? 'bg-green-400' : 'bg-green-600'
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'subjects' && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {subjectProgress.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    'p-6 rounded-xl border-2 transition-all duration-200',
                    getRarityColor(achievement.rarity)
                  )}
                >
                  <div className="text-center space-y-3">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{achievement.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                      <span>{achievement.category}</span>
                      <span>•</span>
                      <span className="capitalize">{achievement.rarity}</span>
                      <span>•</span>
                      <span>{achievement.earnedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className={cn('p-3 rounded-xl', `${insight.color.replace('text-', 'bg-')}-100`)}>
                    <insight.icon className={cn('w-6 h-6', insight.color)} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      )}>
                        {insight.priority} priority
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{insight.description}</p>
                    
                    {insight.action && (
                      <Button variant="outline" size="sm">
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};