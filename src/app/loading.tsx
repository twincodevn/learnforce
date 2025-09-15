import { BookOpen } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <BookOpen className="w-8 h-8 text-blue-600 animate-pulse" />
          <span className="text-2xl font-bold text-gray-900">LearnForce</span>
        </div>
        <div className="flex items-center gap-1 mb-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-gray-600">Preparing your learning experience...</p>
      </div>
    </div>
  );
}