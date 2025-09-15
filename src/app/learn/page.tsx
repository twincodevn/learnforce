"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { LessonCard } from "@/components/features/lessons/lesson-card";
import { LeaderboardDisplay } from "@/components/features/leaderboard/leaderboard-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Filter, Search } from "lucide-react";
import { useState, useEffect } from "react";

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
}

interface LessonData {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  xpReward: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  progress?: {
    completed: boolean;
    score?: number;
    xpEarned?: number;
    completedAt?: string;
  } | null;
}

export default function LearnPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/subjects');
        if (!response.ok) throw new Error('Failed to fetch subjects');
        const data = await response.json();
        setSubjects(data);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load subjects');
      }
    };

    fetchSubjects();
  }, []);

  // Fetch lessons when component mounts or subject changes
  useEffect(() => {
    const fetchLessons = async () => {
      setIsLoading(true);
      try {
        const url = selectedSubject 
          ? `/api/lessons?subjectId=${selectedSubject}`
          : '/api/lessons';
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch lessons');
        const data = await response.json();
        setLessons(data);
      } catch (err) {
        console.error('Error fetching lessons:', err);
        setError('Failed to load lessons');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [selectedSubject]);

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learn</h1>
            <p className="text-gray-600">Continue your learning journey</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search lessons..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Subject Tabs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="text-red-600 text-center py-4">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedSubject === subject.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedSubject(
                        selectedSubject === subject.id ? null : subject.id
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{subject.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {subject.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {subject.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {subject.completedLessons}/{subject.totalLessons} lessons
                        </span>
                        <span>
                          {subject.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lessons Grid */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {selectedSubject 
                  ? `${subjects.find(s => s.id === selectedSubject)?.name} Lessons`
                  : "All Lessons"
                }
              </h2>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : filteredLessons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredLessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={{
                        id: lesson.id,
                        subjectId: lesson.subjectId,
                        title: lesson.title,
                        description: lesson.description,
                        content: lesson.content,
                        order: lesson.order,
                        xpReward: lesson.xpReward,
                        isActive: lesson.isActive,
                        createdAt: new Date(lesson.createdAt),
                        updatedAt: new Date(lesson.updatedAt)
                      }}
                      progress={lesson.progress ? {
                        completed: lesson.progress.completed,
                        score: lesson.progress.score || 0,
                        xpEarned: lesson.progress.xpEarned || 0
                      } : undefined}
                      isLocked={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No lessons found matching your criteria.</p>
                  {selectedSubject && (
                    <button
                      onClick={() => setSelectedSubject(null)}
                      className="text-blue-600 hover:underline mt-2"
                    >
                      Show all lessons
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <LeaderboardDisplay period="weekly" limit={5} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
