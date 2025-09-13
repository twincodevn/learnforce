"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { LessonCard } from "@/components/features/lessons/lesson-card";
import { LeaderboardDisplay } from "@/components/features/leaderboard/leaderboard-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Filter, Search } from "lucide-react";
import { serializeLessonContent } from "@/lib/utils/lesson";
import { useState } from "react";

// Mock data - replace with real data from your API
const mockSubjects = [
  {
    id: "1",
    name: "JavaScript Fundamentals",
    description: "Learn the basics of JavaScript programming",
    icon: "📚",
    color: "blue",
    totalLessons: 12,
    completedLessons: 8,
  },
  {
    id: "2",
    name: "React Development",
    description: "Master React components and hooks",
    icon: "⚛️",
    color: "green",
    totalLessons: 15,
    completedLessons: 3,
  },
  {
    id: "3",
    name: "TypeScript",
    description: "Type-safe JavaScript development",
    icon: "🔷",
    color: "purple",
    totalLessons: 10,
    completedLessons: 0,
  },
];

const mockLessons = [
  {
    id: "1",
    subjectId: "1",
    title: "Variables and Data Types",
    description: "Learn about JavaScript variables and different data types",
    content: serializeLessonContent({
      type: "multiple_choice",
      question: "What is the correct way to declare a variable in JavaScript?",
      options: ["var x = 5", "variable x = 5", "v x = 5", "declare x = 5"],
      correctAnswer: "var x = 5",
    }),
    order: 1,
    xpReward: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    subjectId: "1",
    title: "Functions and Scope",
    description: "Understanding function declarations and variable scope",
    content: serializeLessonContent({
      type: "fill_blank",
      question: "Complete the function to return the sum of two numbers",
      correctAnswer: "return a + b",
    }),
    order: 2,
    xpReward: 15,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    subjectId: "1",
    title: "Arrays and Loops",
    description: "Working with arrays and different types of loops",
    content: serializeLessonContent({
      type: "multiple_choice",
      question: "Which method adds an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctAnswer: "push()",
    }),
    order: 3,
    xpReward: 12,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    subjectId: "2",
    title: "React Components",
    description: "Creating your first React component",
    content: serializeLessonContent({
      type: "translation",
      question: "Convert this HTML to JSX",
      correctAnswer: "<div className='container'>Hello World</div>",
    }),
    order: 1,
    xpReward: 20,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockProgress = {
  "1": { completed: true, score: 85, xpEarned: 10 },
  "2": { completed: true, score: 92, xpEarned: 15 },
  "3": { completed: false, score: 0, xpEarned: 0 },
  "4": { completed: false, score: 0, xpEarned: 0 },
};

export default function LearnPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLessons = mockLessons.filter((lesson) => {
    const matchesSubject = !selectedSubject || lesson.subjectId === selectedSubject;
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockSubjects.map((subject) => (
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
                          {Math.round((subject.completedLessons / subject.totalLessons) * 100)}%
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
                  ? `${mockSubjects.find(s => s.id === selectedSubject)?.name} Lessons`
                  : "All Lessons"
                }
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    progress={mockProgress[lesson.id as keyof typeof mockProgress]}
                    isLocked={false}
                  />
                ))}
              </div>
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
