'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Zap, 
  BookOpen,
  Star,
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Repeat,
  Trophy,
  Activity,
  Settings,
  Shuffle,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface LearningProfile {
  id: string;
  userId: string;
  strengths: string[];
  weaknesses: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  difficultyPreference: 'easy' | 'medium' | 'hard' | 'adaptive';
  averageSessionLength: number;
  optimalStudyTimes: string[];
  retentionRate: number;
  lastUpdated: Date;
}

interface SpacedRepetitionCard {
  id: string;
  lessonId: string;
  concept: string;
  difficulty: number;
  lastReviewed: Date;
  nextReview: Date;
  interval: number; // in days
  easeFactor: number;
  reviewCount: number;
  successCount: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface StudyRecommendation {
  id: string;
  type: 'lesson' | 'review' | 'practice' | 'challenge';
  title: string;
  description: string;
  reason: string;
  estimatedTime: number;
  difficulty: number;
  priority: number;
  confidence: number;
  concepts: string[];
  prerequisites: string[];
  learningObjectives: string[];
}

interface PerformanceMetrics {
  accuracy: number;
  speed: number;
  consistency: number;
  retention: number;
  engagement: number;
  trend: 'improving' | 'stable' | 'declining';
}

interface AdaptiveLearningSystemProps {
  userId: string;
  currentSubject: string;
  onStartRecommendation: (recommendationId: string) => void;
  onUpdateProfile: (profile: Partial<LearningProfile>) => void;
  onScheduleReview: (cardId: string, difficulty: number) => void;
}

export const AdaptiveLearningSystem: React.FC<AdaptiveLearningSystemProps> = ({
  userId,
  currentSubject,
  onStartRecommendation,
  onUpdateProfile,
  onScheduleReview,
}) => {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'spaced-repetition' | 'performance' | 'settings'>('recommendations');
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const [spacedCards, setSpacedCards] = useState<SpacedRepetitionCard[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [autoMode, setAutoMode] = useState(false);

  // Mock data
  useEffect(() => {
    const mockProfile: LearningProfile = {
      id: '1',
      userId,
      strengths: ['Problem Solving', 'Pattern Recognition', 'Logical Thinking'],
      weaknesses: ['Time Management', 'Complex Syntax', 'Debugging'],
      learningStyle: 'visual',
      difficultyPreference: 'adaptive',
      averageSessionLength: 25,
      optimalStudyTimes: ['09:00', '14:00', '19:00'],
      retentionRate: 78,
      lastUpdated: new Date(),
    };

    const mockRecommendations: StudyRecommendation[] = [
      {
        id: '1',
        type: 'lesson',
        title: 'Advanced Array Methods',
        description: 'Master map, filter, and reduce for data manipulation',
        reason: 'Based on your strength in pattern recognition and recent progress',
        estimatedTime: 20,
        difficulty: 7,
        priority: 9,
        confidence: 0.92,
        concepts: ['Array Methods', 'Functional Programming', 'Data Transformation'],
        prerequisites: ['Basic Arrays', 'Functions'],
        learningObjectives: ['Apply array methods efficiently', 'Understand functional paradigms'],
      },
      {
        id: '2',
        type: 'review',
        title: 'Variable Scoping Review',
        description: 'Reinforce understanding of let, const, and var',
        reason: 'Retention analysis suggests review needed for long-term memory',
        estimatedTime: 15,
        difficulty: 4,
        priority: 8,
        confidence: 0.85,
        concepts: ['Variable Scoping', 'Hoisting', 'Block Scope'],
        prerequisites: [],
        learningObjectives: ['Distinguish scope types', 'Predict variable behavior'],
      },
      {
        id: '3',
        type: 'practice',
        title: 'Debugging Challenge',
        description: 'Practice identifying and fixing common JavaScript errors',
        reason: 'Targeted practice for your identified weakness in debugging',
        estimatedTime: 30,
        difficulty: 6,
        priority: 7,
        confidence: 0.78,
        concepts: ['Debugging', 'Error Handling', 'Developer Tools'],
        prerequisites: ['Basic Syntax', 'Control Flow'],
        learningObjectives: ['Identify common errors', 'Use debugging tools effectively'],
      },
    ];

    const mockSpacedCards: SpacedRepetitionCard[] = [
      {
        id: '1',
        lessonId: 'lesson-1',
        concept: 'JavaScript Closures',
        difficulty: 8,
        lastReviewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        nextReview: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        interval: 3,
        easeFactor: 2.5,
        reviewCount: 4,
        successCount: 3,
        status: 'review',
        priority: 'high',
      },
      {
        id: '2',
        lessonId: 'lesson-2',
        concept: 'Async/Await Patterns',
        difficulty: 7,
        lastReviewed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        nextReview: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        interval: 4,
        easeFactor: 2.1,
        reviewCount: 3,
        successCount: 2,
        status: 'review',
        priority: 'critical',
      },
      {
        id: '3',
        lessonId: 'lesson-3',
        concept: 'Array Destructuring',
        difficulty: 5,
        lastReviewed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        nextReview: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        interval: 14,
        easeFactor: 2.8,
        reviewCount: 6,
        successCount: 6,
        status: 'mastered',
        priority: 'low',
      },
    ];

    const mockMetrics: PerformanceMetrics = {
      accuracy: 82,
      speed: 75,
      consistency: 88,
      retention: 78,
      engagement: 91,
      trend: 'improving',
    };

    setProfile(mockProfile);
    setRecommendations(mockRecommendations);
    setSpacedCards(mockSpacedCards);
    setMetrics(mockMetrics);
  }, [userId]);

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'text-green-600 bg-green-100';
    if (difficulty <= 6) return 'text-yellow-600 bg-yellow-100';
    if (difficulty <= 8) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const RecommendationCard: React.FC<{ recommendation: StudyRecommendation }> = ({ recommendation }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn('p-3 rounded-xl', 
            recommendation.type === 'lesson' ? 'bg-blue-100' :
            recommendation.type === 'review' ? 'bg-orange-100' :
            recommendation.type === 'practice' ? 'bg-green-100' : 'bg-purple-100'
          )}>
            {recommendation.type === 'lesson' ? <BookOpen className="w-6 h-6 text-blue-600" /> :
             recommendation.type === 'review' ? <Repeat className="w-6 h-6 text-orange-600" /> :
             recommendation.type === 'practice' ? <Target className="w-6 h-6 text-green-600" /> :
             <Trophy className="w-6 h-6 text-purple-600" />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-2">
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getDifficultyColor(recommendation.difficulty))}>
              Level {recommendation.difficulty}
            </span>
            <span className="text-sm text-gray-500">{recommendation.estimatedTime}min</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn('w-3 h-3', i < Math.round(recommendation.priority / 2) ? 'text-yellow-400 fill-current' : 'text-gray-300')}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">{Math.round(recommendation.confidence * 100)}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Why this recommendation?</span>
          </div>
          <p className="text-sm text-blue-800">{recommendation.reason}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {recommendation.concepts.slice(0, 3).map((concept) => (
            <span
              key={concept}
              className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
            >
              {concept}
            </span>
          ))}
          {recommendation.concepts.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{recommendation.concepts.length - 3} more
            </span>
          )}
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={() => onStartRecommendation(recommendation.id)}
        >
          Start {recommendation.type === 'lesson' ? 'Learning' : 
                 recommendation.type === 'review' ? 'Review' : 
                 recommendation.type === 'practice' ? 'Practice' : 'Challenge'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );

  const SpacedRepetitionCard: React.FC<{ card: SpacedRepetitionCard }> = ({ card }) => {
    const isOverdue = new Date() > card.nextReview;
    const successRate = card.reviewCount > 0 ? (card.successCount / card.reviewCount) * 100 : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'bg-white rounded-xl border p-4 transition-all duration-200',
          isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:shadow-md'
        )}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">{card.concept}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span>Reviewed {card.reviewCount} times</span>
              <span>{Math.round(successRate)}% success rate</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(card.priority))}>
              {card.priority}
            </span>
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              card.status === 'mastered' ? 'bg-green-100 text-green-800' :
              card.status === 'review' ? 'bg-orange-100 text-orange-800' :
              card.status === 'learning' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            )}>
              {card.status}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Next Review:</span>
            <span className={cn(isOverdue ? 'text-red-600 font-medium' : 'text-gray-600')}>
              {isOverdue ? 'Overdue' : card.nextReview.toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Interval:</span>
            <span className="text-gray-600">{card.interval} days</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Ease Factor:</span>
            <span className="text-gray-600">{card.easeFactor.toFixed(1)}</span>
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <Button
            variant={isOverdue ? 'primary' : 'outline'}
            size="sm"
            fullWidth
            onClick={() => onScheduleReview(card.id, card.difficulty)}
          >
            {isOverdue ? 'Review Now' : 'Practice'}
          </Button>
        </div>
      </motion.div>
    );
  };

  const MetricCard: React.FC<{ 
    title: string; 
    value: number; 
    trend: string; 
    icon: React.ComponentType<any>;
    color: string;
  }> = ({ title, value, trend, icon: Icon, color }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={cn('p-2 rounded-lg', `${color.replace('text-', 'bg-')}-100`)}>
          <Icon className={cn('w-5 h-5', color)} />
        </div>
        {getTrendIcon(trend)}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900">{value}%</div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
      
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div 
          className={cn('h-2 rounded-full transition-all duration-300', color.replace('text-', 'bg-'))}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  if (!profile || !metrics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Learning Assistant</h1>
          <p className="text-gray-600 mt-1">Personalized recommendations powered by adaptive algorithms</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Auto Mode</span>
            <button
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                autoMode ? 'bg-green-500' : 'bg-gray-300'
              )}
              onClick={() => setAutoMode(!autoMode)}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  autoMode ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
          
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Learning Style</div>
              <div className="text-xl font-bold capitalize">{profile.learningStyle}</div>
            </div>
            <Brain className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Retention Rate</div>
              <div className="text-xl font-bold">{profile.retentionRate}%</div>
            </div>
            <Target className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Session Length</div>
              <div className="text-xl font-bold">{profile.averageSessionLength}min</div>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center justify-center">
        <div className="bg-gray-100 p-1 rounded-xl">
          {(['recommendations', 'spaced-repetition', 'performance', 'settings'] as const).map((tab) => (
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
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'recommendations' && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              {recommendations.map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'spaced-repetition' && (
          <motion.div
            key="spaced-repetition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Spaced Repetition Schedule</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-200 rounded-full"></div>
                    <span>Overdue</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-200 rounded-full"></div>
                    <span>Due Soon</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-200 rounded-full"></div>
                    <span>Mastered</span>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {spacedCards.map((card) => (
                  <SpacedRepetitionCard key={card.id} card={card} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'performance' && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <MetricCard
                title="Accuracy"
                value={metrics.accuracy}
                trend={metrics.trend}
                icon={Target}
                color="text-green-600"
              />
              <MetricCard
                title="Speed"
                value={metrics.speed}
                trend={metrics.trend}
                icon={Zap}
                color="text-yellow-600"
              />
              <MetricCard
                title="Consistency"
                value={metrics.consistency}
                trend={metrics.trend}
                icon={Activity}
                color="text-blue-600"
              />
              <MetricCard
                title="Retention"
                value={metrics.retention}
                trend={metrics.trend}
                icon={Brain}
                color="text-purple-600"
              />
              <MetricCard
                title="Engagement"
                value={metrics.engagement}
                trend={metrics.trend}
                icon={Star}
                color="text-orange-600"
              />
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Strengths
                </h3>
                <div className="space-y-2">
                  {profile.strengths.map((strength) => (
                    <div key={strength} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  Areas for Improvement
                </h3>
                <div className="space-y-2">
                  {profile.weaknesses.map((weakness) => (
                    <div key={weakness} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-800">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};