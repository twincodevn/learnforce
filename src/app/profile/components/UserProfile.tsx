'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Target, 
  Clock,
  Edit,
  Save,
  X,
  Camera,
  Settings,
  BarChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XPLevelSystem } from '@/components/features/gamification/XPLevelSystem';
import { StreakCounter } from '@/components/features/gamification/StreakCounter';

interface UserData {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalLessonsCompleted: number;
  totalTimeSpent: number;
  createdAt: string;
  lastActiveAt?: string;
  achievements: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
}

export function UserProfile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: '',
    username: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/profile`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const data = await response.json();
        setUserData(data);
        setEditData({
          fullName: data.fullName || '',
          username: data.username || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback data structure
        setUserData({
          id: user.id,
          email: user.email || '',
          username: user.name || 'user',
          fullName: user.name || '',
          xp: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          totalLessonsCompleted: 0,
          totalTimeSpent: 0,
          createdAt: new Date().toISOString(),
          achievements: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Card className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                {userData.avatarUrl ? (
                  <img
                    src={userData.avatarUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={editData.fullName}
                    onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/60"
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={editData.username}
                    onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/60"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({
                          fullName: userData.fullName || '',
                          username: userData.username || '',
                        });
                      }} 
                      size="sm" 
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">
                      {userData.fullName || userData.username}
                    </h1>
                    <Button
                      onClick={() => setIsEditing(true)}
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-blue-100">@{userData.username}</p>
                  <div className="flex items-center gap-4 text-sm text-blue-100">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {userData.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(userData.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{userData.level}</div>
                <div className="text-sm text-blue-100">Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{userData.currentStreak}</div>
                <div className="text-sm text-blue-100">Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{userData.totalLessonsCompleted}</div>
                <div className="text-sm text-blue-100">Lessons</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats & Gamification */}
        <div className="lg:col-span-2 space-y-6">
          {/* XP & Level Progress */}
          <XPLevelSystem />

          {/* Learning Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Learning Statistics
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userData.xp}</div>
                  <div className="text-sm text-gray-600">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userData.totalLessonsCompleted}</div>
                  <div className="text-sm text-gray-600">Lessons Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(userData.totalTimeSpent / 60)}h
                  </div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userData.longestStreak}</div>
                  <div className="text-sm text-gray-600">Best Streak</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Recent Achievements
              </h3>
              
              {userData.achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {userData.achievements.slice(0, 6).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {achievement.name}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {achievement.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No achievements yet.</p>
                  <p className="text-sm">Keep learning to unlock your first achievement!</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Streak & Settings */}
        <div className="space-y-6">
          {/* Streak Counter */}
          <StreakCounter />

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Account Settings
              </h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Change Email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Daily Goals
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Learning Preferences
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}