"use client";

import { Lesson } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Play, Lock, CheckCircle } from "lucide-react";
import { parseLessonContent } from "@/lib/utils/lesson";
import Link from "next/link";

interface LessonCardProps {
  lesson: Lesson;
  progress?: {
    completed: boolean;
    score?: number;
    xpEarned?: number;
  };
  isLocked?: boolean;
}

export function LessonCard({ lesson, progress, isLocked = false }: LessonCardProps) {
  const isCompleted = progress?.completed || false;
  const score = progress?.score || 0;
  const lessonContent = parseLessonContent(lesson.content);

  return (
    <Card className={`relative overflow-hidden transition-all duration-200 hover:shadow-md ${
      isLocked ? "opacity-60" : "hover:scale-105"
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {lesson.title}
            </CardTitle>
            {lesson.description && (
              <p className="text-sm text-gray-600 mt-1">
                {lesson.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isCompleted && (
              <CheckCircle className="w-6 h-6 text-green-500" />
            )}
            {isLocked && (
              <Lock className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* XP Reward */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">XP Reward</span>
            <span className="font-semibold text-yellow-600">
              +{lesson.xpReward} XP
            </span>
          </div>

          {/* Progress */}
          {isCompleted && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Score</span>
                <span className="font-semibold text-gray-900">
                  {score}%
                </span>
              </div>
              <ProgressBar
                value={score}
                max={100}
                color="success"
                className="h-2"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            {isLocked ? (
              <Button
                variant="outline"
                className="w-full"
                disabled
              >
                <Lock className="w-4 h-4 mr-2" />
                Locked
              </Button>
            ) : (
              <Link href={`/learn/${lesson.id}`} className="block">
                <Button
                  variant={isCompleted ? "secondary" : "primary"}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isCompleted ? "Review" : "Start Lesson"}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>

      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            Completed
          </div>
        </div>
      )}
    </Card>
  );
}
