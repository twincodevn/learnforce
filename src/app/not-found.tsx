'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for seems to have wandered off. 
            Let's get you back on track with your learning journey.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="flex items-center gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/dashboard">
                <BookOpen className="w-4 h-4" />
                Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Popular destinations:</p>
            <div className="mt-2 space-x-4">
              <Link href="/learn" className="text-blue-600 hover:underline">
                Learn
              </Link>
              <Link href="/leaderboard" className="text-blue-600 hover:underline">
                Leaderboard
              </Link>
              <Link href="/profile" className="text-blue-600 hover:underline">
                Profile
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}