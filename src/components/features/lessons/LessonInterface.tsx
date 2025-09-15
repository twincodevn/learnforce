'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  X, 
  Check, 
  Star, 
  Trophy, 
  Zap,
  ChevronLeft,
  Volume2,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { colors } from '@/lib/design-system/colors';

interface Question {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'translation' | 'listening' | 'speaking';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  hints?: string[];
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  questions: Question[];
  estimatedTime: number;
}

interface LessonInterfaceProps {
  lesson: LessonData;
  initialHearts?: number;
  onComplete: (result: {
    score: number;
    xpEarned: number;
    timeSpent: number;
    correctAnswers: number;
    totalQuestions: number;
  }) => void;
  onExit: () => void;
}

export const LessonInterface: React.FC<LessonInterfaceProps> = ({
  lesson,
  initialHearts = 5,
  onComplete,
  onExit,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hearts, setHearts] = useState(initialHearts);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime] = useState(Date.now());
  const [showHint, setShowHint] = useState(false);
  const [usedHints, setUsedHints] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState(0);

  const currentQuestion = lesson.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / lesson.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === lesson.questions.length - 1;

  const checkAnswer = (answer: string) => {
    const correct = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer.includes(answer)
      : currentQuestion.correctAnswer === answer;

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(prev => prev + (usedHints.has(currentQuestion.id) ? 50 : 100));
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setHearts(prev => Math.max(0, prev - 1));
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      // Complete lesson
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const finalScore = Math.floor((score / (lesson.questions.length * 100)) * 100);
      const xpEarned = Math.floor((finalScore / 100) * lesson.xpReward);

      onComplete({
        score: finalScore,
        xpEarned,
        timeSpent,
        correctAnswers,
        totalQuestions: lesson.questions.length,
      });
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowHint(false);
    }
  };

  const useHint = () => {
    setShowHint(true);
    setUsedHints(prev => new Set(prev).add(currentQuestion.id));
  };

  const playAudio = () => {
    if (currentQuestion.audioUrl) {
      const audio = new Audio(currentQuestion.audioUrl);
      audio.play();
    }
  };

  // Game over when hearts reach 0
  useEffect(() => {
    if (hearts <= 0) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const finalScore = Math.floor((score / (lesson.questions.length * 100)) * 100);
      
      onComplete({
        score: finalScore,
        xpEarned: 0, // No XP for failed attempts
        timeSpent,
        correctAnswers,
        totalQuestions: lesson.questions.length,
      });
    }
  }, [hearts]);

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <div className="grid gap-3">
              {currentQuestion.options?.map((option, index) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all duration-200',
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                    showFeedback && selectedAnswer === option && isCorrect && 'border-green-500 bg-green-50',
                    showFeedback && selectedAnswer === option && !isCorrect && 'border-red-500 bg-red-50'
                  )}
                  onClick={() => !showFeedback && setSelectedAnswer(option)}
                  disabled={showFeedback}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{option}</span>
                    {showFeedback && selectedAnswer === option && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          'rounded-full p-1',
                          isCorrect ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {isCorrect ? <Check size={20} /> : <X size={20} />}
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'fill_blank':
        return (
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="Type your answer..."
              value={selectedAnswer || ''}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && selectedAnswer && !showFeedback && checkAnswer(selectedAnswer)}
              disabled={showFeedback}
            />
          </div>
        );

      case 'translation':
        return (
          <div className="space-y-4">
            <textarea
              className="w-full p-4 h-32 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Enter your translation..."
              value={selectedAnswer || ''}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={showFeedback}
            />
          </div>
        );

      case 'listening':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={playAudio}
                className="mx-auto"
              >
                <Volume2 className="mr-2" size={20} />
                Play Audio
              </Button>
            </div>
            <input
              type="text"
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="Type what you hear..."
              value={selectedAnswer || ''}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={showFeedback}
            />
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Button variant="ghost" size="sm" onClick={onExit}>
          <ChevronLeft size={20} />
        </Button>
        
        {/* Progress Bar */}
        <div className="flex-1 mx-4">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Hearts */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Heart
              key={i}
              size={20}
              className={cn(
                'transition-colors duration-200',
                i < hearts ? 'text-red-500 fill-red-500' : 'text-gray-300'
              )}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6">
        {/* Streak Display */}
        {streak > 1 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
              <Zap className="fill-current" size={16} />
              <span className="font-semibold">{streak} streak!</span>
            </div>
          </motion.div>
        )}

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Question Text */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {currentQuestion.question}
              </h2>
              
              {currentQuestion.imageUrl && (
                <div className="flex justify-center">
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Question illustration"
                    className="max-w-sm rounded-xl shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Question Content */}
            {renderQuestion()}

            {/* Hint */}
            {showHint && currentQuestion.hints && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <Lightbulb className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-yellow-800">Hint:</p>
                    <p className="text-yellow-700">{currentQuestion.hints[0]}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    'p-4 rounded-xl border-l-4',
                    isCorrect
                      ? 'bg-green-50 border-green-400 text-green-800'
                      : 'bg-red-50 border-red-400 text-red-800'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      'rounded-full p-2',
                      isCorrect ? 'bg-green-200' : 'bg-red-200'
                    )}>
                      {isCorrect ? (
                        <Check className="text-green-600" size={20} />
                      ) : (
                        <X className="text-red-600" size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </p>
                      {currentQuestion.explanation && (
                        <p className="mt-1">{currentQuestion.explanation}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          {!showFeedback ? (
            <div className="flex space-x-4">
              {currentQuestion.hints && !usedHints.has(currentQuestion.id) && (
                <Button
                  variant="outline"
                  onClick={useHint}
                  className="flex-1"
                >
                  <Lightbulb className="mr-2" size={16} />
                  Hint
                </Button>
              )}
              
              <Button
                variant="primary"
                fullWidth={!currentQuestion.hints || usedHints.has(currentQuestion.id)}
                onClick={() => selectedAnswer && checkAnswer(selectedAnswer)}
                disabled={!selectedAnswer}
              >
                Check Answer
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              fullWidth
              onClick={nextQuestion}
            >
              {isLastQuestion ? 'Complete Lesson' : 'Continue'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};