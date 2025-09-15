'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LessonInterface } from '@/components/features/lessons/LessonInterface';
import { LessonCompleteModal } from '@/components/features/lessons/LessonCompleteModal';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface LessonData {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  questions: any[];
  estimatedTime: number;
}

interface LessonResult {
  score: number;
  xpEarned: number;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
}

export default function LessonPage({ params }: { params: { lessonId: string } }) {
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<LessonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/lessons/${params.lessonId}`);
        
        if (!response.ok) {
          throw new Error('Lesson not found');
        }
        
        const lessonData = await response.json();
        
        // Parse the lesson content
        const content = JSON.parse(lessonData.content);
        
        // Transform to the expected format
        const transformedLesson: LessonData = {
          id: lessonData.id,
          title: lessonData.title,
          description: lessonData.description,
          xpReward: lessonData.xp_reward,
          estimatedTime: 5, // Default estimate
          questions: [{
            id: '1',
            ...content
          }]
        };
        
        setLesson(transformedLesson);
      } catch (error) {
        console.error('Error fetching lesson:', error);
        setError('Failed to load lesson');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [params.lessonId]);

  const handleLessonComplete = async (lessonResult: LessonResult) => {
    try {
      // Submit lesson completion to backend
      const response = await fetch(`/api/lessons/${params.lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: lessonResult.score,
          timeSpent: lessonResult.timeSpent,
          answers: {
            '1': { /* answer data would go here */ }
          }
        })
      });

      if (response.ok) {
        const completionData = await response.json();
        setResult({
          ...lessonResult,
          xpEarned: completionData.xpEarned
        });
        setIsCompleted(true);
      } else {
        console.error('Failed to submit lesson completion');
        setResult(lessonResult);
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      setResult(lessonResult);
      setIsCompleted(true);
    }
  };

  const handleExit = () => {
    router.push('/learn');
  };

  const handleContinue = () => {
    router.push('/learn');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600 animate-pulse" />
            <span className="text-2xl font-bold text-gray-900">Loading Lesson</span>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-gray-600">Preparing your lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Lesson Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              {error || 'The lesson you are looking for could not be found.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <button
              onClick={() => router.push('/learn')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Lessons
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <LessonInterface
        lesson={lesson}
        onComplete={handleLessonComplete}
        onExit={handleExit}
      />
      
      {isCompleted && result && (
        <LessonCompleteModal
          isOpen={isCompleted}
          result={{
            score: result.score,
            xpEarned: result.xpEarned,
            timeSpent: result.timeSpent,
            correctAnswers: result.correctAnswers,
            totalQuestions: result.totalQuestions,
            perfectScore: result.score === 100,
            newAchievements: [] // Could be populated from API response
          }}
          onClose={handleContinue}
          onContinue={handleContinue}
          onReview={() => {
            // Could implement lesson review functionality
            handleContinue();
          }}
        />
      )}
    </>
  );
}