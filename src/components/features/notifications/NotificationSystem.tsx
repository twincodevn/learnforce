'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  Trophy, 
  Zap, 
  Calendar,
  Clock,
  Users,
  Star,
  Target,
  BookOpen,
  Flame,
  Heart,
  Settings,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
  Gift,
  TrendingUp,
  Award,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'social' | 'milestone' | 'streak' | 'challenge' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    userId?: string;
    achievementId?: string;
    challengeId?: string;
    streakDays?: number;
    xpEarned?: number;
  };
}

interface NotificationSettings {
  push: {
    enabled: boolean;
    dailyReminders: boolean;
    achievements: boolean;
    socialActivity: boolean;
    streakReminders: boolean;
    challenges: boolean;
  };
  email: {
    enabled: boolean;
    weeklyProgress: boolean;
    achievements: boolean;
    socialActivity: boolean;
    marketingEmails: boolean;
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    mobile: boolean;
  };
  schedule: {
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    frequency: 'instant' | 'batched' | 'daily';
    timezone: string;
  };
}

interface NotificationSystemProps {
  userId: string;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onUpdateSettings: (settings: Partial<NotificationSettings>) => void;
  onNavigateToAction: (url: string) => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  userId,
  onMarkAsRead,
  onMarkAllAsRead,
  onUpdateSettings,
  onNavigateToAction,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
  const [filter, setFilter] = useState<'all' | 'unread' | 'achievements' | 'reminders' | 'social'>('all');
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Mock data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'achievement',
        title: '🏆 Achievement Unlocked!',
        message: 'Congratulations! You earned the "Streak Master" achievement for maintaining a 7-day learning streak.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false,
        priority: 'high',
        actionUrl: '/achievements',
        actionText: 'View Achievement',
        metadata: { achievementId: 'streak-master-7', xpEarned: 100 }
      },
      {
        id: '2',
        type: 'reminder',
        title: '📚 Daily Learning Reminder',
        message: 'Keep your streak alive! You have 3 hours left to complete today\'s learning goal.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        priority: 'medium',
        actionUrl: '/learn',
        actionText: 'Start Learning',
      },
      {
        id: '3',
        type: 'social',
        title: '👥 Challenge from CodeMaster',
        message: 'CodeMaster challenged you to an XP race! First to 100 XP wins.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        priority: 'medium',
        actionUrl: '/challenges/1',
        actionText: 'Accept Challenge',
        metadata: { userId: 'codemaster', challengeId: 'xp-race-100' }
      },
      {
        id: '4',
        type: 'milestone',
        title: '🎯 Level 25 Reached!',
        message: 'Amazing progress! You\'ve reached Level 25 and earned 50 bonus XP.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: true,
        priority: 'high',
        actionUrl: '/profile',
        actionText: 'View Profile',
        metadata: { xpEarned: 50 }
      },
      {
        id: '5',
        type: 'streak',
        title: '🔥 Streak in Danger!',
        message: 'Your 23-day learning streak will break in 2 hours. Complete a lesson to keep it alive!',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isRead: true,
        priority: 'urgent',
        actionUrl: '/learn',
        actionText: 'Save Streak',
        metadata: { streakDays: 23 }
      }
    ];

    const mockSettings: NotificationSettings = {
      push: {
        enabled: true,
        dailyReminders: true,
        achievements: true,
        socialActivity: true,
        streakReminders: true,
        challenges: true,
      },
      email: {
        enabled: true,
        weeklyProgress: true,
        achievements: true,
        socialActivity: false,
        marketingEmails: false,
      },
      inApp: {
        enabled: true,
        sound: true,
        desktop: true,
        mobile: true,
      },
      schedule: {
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '08:00',
        },
        frequency: 'instant',
        timezone: 'America/New_York',
      },
    };

    setNotifications(mockNotifications);
    setSettings(mockSettings);
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermission(permission);
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('🎉 Test Notification', {
        body: 'Notifications are working perfectly!',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
      });
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement': return Trophy;
      case 'reminder': return Bell;
      case 'social': return Users;
      case 'milestone': return Star;
      case 'streak': return Flame;
      case 'challenge': return Target;
      case 'system': return Settings;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'urgent') return 'border-l-red-500 bg-red-50';
    if (priority === 'high') return 'border-l-orange-500 bg-orange-50';
    
    switch (type) {
      case 'achievement': return 'border-l-yellow-500 bg-yellow-50';
      case 'social': return 'border-l-blue-500 bg-blue-50';
      case 'streak': return 'border-l-orange-500 bg-orange-50';
      case 'milestone': return 'border-l-purple-500 bg-purple-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'achievements') return notification.type === 'achievement' || notification.type === 'milestone';
    if (filter === 'reminders') return notification.type === 'reminder' || notification.type === 'streak';
    if (filter === 'social') return notification.type === 'social' || notification.type === 'challenge';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const NotificationCard: React.FC<{ notification: Notification }> = ({ notification }) => {
    const Icon = getNotificationIcon(notification.type);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className={cn(
          'p-4 border-l-4 rounded-r-lg transition-all duration-200 hover:shadow-md cursor-pointer',
          notification.isRead ? 'bg-white border-l-gray-300' : getNotificationColor(notification.type, notification.priority)
        )}
        onClick={() => {
          if (!notification.isRead) {
            onMarkAsRead(notification.id);
            setNotifications(prev => 
              prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
            );
          }
          if (notification.actionUrl) {
            onNavigateToAction(notification.actionUrl);
          }
        }}
      >
        <div className="flex items-start space-x-3">
          <div className={cn(
            'p-2 rounded-full',
            notification.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
            notification.type === 'social' ? 'bg-blue-100 text-blue-600' :
            notification.type === 'streak' ? 'bg-orange-100 text-orange-600' :
            notification.type === 'milestone' ? 'bg-purple-100 text-purple-600' :
            'bg-gray-100 text-gray-600'
          )}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{notification.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                
                {notification.metadata && (
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                    {notification.metadata.xpEarned && (
                      <span className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span>+{notification.metadata.xpEarned} XP</span>
                      </span>
                    )}
                    {notification.metadata.streakDays && (
                      <span className="flex items-center space-x-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span>{notification.metadata.streakDays} day streak</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-2">
                <span className="text-xs text-gray-500">{getTimeAgo(notification.timestamp)}</span>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
            
            {notification.actionText && (
              <div className="mt-3">
                <Button variant="outline" size="sm">
                  {notification.actionText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const SettingsSection: React.FC<{ 
    title: string; 
    children: React.ReactNode; 
    icon: React.ComponentType<any> 
  }> = ({ title, children, icon: Icon }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch: React.FC<{ 
    enabled: boolean; 
    onChange: (enabled: boolean) => void;
    label: string;
    description?: string;
  }> = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        {description && (
          <div className="text-sm text-gray-500 mt-1">{description}</div>
        )}
      </div>
      <button
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          enabled ? 'bg-green-500' : 'bg-gray-300'
        )}
        onClick={() => onChange(!enabled)}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            enabled ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                    {unreadCount > 0 && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex mt-4">
                  <button
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      activeTab === 'notifications'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                    onClick={() => setActiveTab('notifications')}
                  >
                    Messages
                  </button>
                  <button
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-colors ml-2',
                      activeTab === 'settings'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                    onClick={() => setActiveTab('settings')}
                  >
                    Settings
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'notifications' ? (
                  <>
                    {/* Filters */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex space-x-2 overflow-x-auto">
                        {(['all', 'unread', 'achievements', 'reminders', 'social'] as const).map((f) => (
                          <button
                            key={f}
                            className={cn(
                              'px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap transition-colors',
                              filter === f
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            )}
                            onClick={() => setFilter(f)}
                          >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                          </button>
                        ))}
                      </div>
                      
                      {unreadCount > 0 && (
                        <button
                          onClick={onMarkAllAsRead}
                          className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="p-4 space-y-3">
                      <AnimatePresence>
                        {filteredNotifications.length > 0 ? (
                          filteredNotifications.map((notification) => (
                            <NotificationCard key={notification.id} notification={notification} />
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No notifications to show</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <div className="p-4 space-y-6">
                    {/* Permission Check */}
                    {permission !== 'granted' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5 text-yellow-600" />
                          <div className="flex-1">
                            <p className="text-sm text-yellow-800">
                              Enable browser notifications to receive real-time updates
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={requestNotificationPermission}
                            >
                              Enable Notifications
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Push Notifications */}
                    <SettingsSection title="Push Notifications" icon={Smartphone}>
                      <div className="space-y-1">
                        <ToggleSwitch
                          enabled={settings.push.enabled}
                          onChange={(enabled) => setSettings(prev => ({
                            ...prev!,
                            push: { ...prev!.push, enabled }
                          }))}
                          label="Enable Push Notifications"
                          description="Receive notifications on this device"
                        />
                        <ToggleSwitch
                          enabled={settings.push.dailyReminders}
                          onChange={(enabled) => setSettings(prev => ({
                            ...prev!,
                            push: { ...prev!.push, dailyReminders: enabled }
                          }))}
                          label="Daily Learning Reminders"
                          description="Remind me to complete my daily goals"
                        />
                        <ToggleSwitch
                          enabled={settings.push.achievements}
                          onChange={(enabled) => setSettings(prev => ({
                            ...prev!,
                            push: { ...prev!.push, achievements: enabled }
                          }))}
                          label="Achievement Notifications"
                          description="Celebrate when you unlock achievements"
                        />
                        <ToggleSwitch
                          enabled={settings.push.socialActivity}
                          onChange={(enabled) => setSettings(prev => ({
                            ...prev!,
                            push: { ...prev!.push, socialActivity: enabled }
                          }))}
                          label="Social Activity"
                          description="Friend requests, challenges, and messages"
                        />
                        <ToggleSwitch
                          enabled={settings.push.streakReminders}
                          onChange={(enabled) => setSettings(prev => ({
                            ...prev!,
                            push: { ...prev!.push, streakReminders: enabled }
                          }))}
                          label="Streak Reminders"
                          description="Don't let your learning streak break"
                        />
                      </div>
                    </SettingsSection>

                    {/* Email Notifications */}
                    <SettingsSection title="Email Notifications" icon={Mail}>
                      <div className="space-y-1">
                        <ToggleSwitch
                          enabled={settings.email.enabled}
                          onChange={(enabled) => setSettings(prev => ({
                            ...prev!,
                            email: { ...prev!.email, enabled }
                          }))}
                          label="Enable Email Notifications"
                        />
                        <ToggleSwitch
                          enabled={settings.email.weeklyProgress}
                          onChange={(enabled) => setSettings(prev => ({
                            ...prev!,
                            email: { ...prev!.email, weeklyProgress: enabled }
                          }))}
                          label="Weekly Progress Reports"
                        />
                        <ToggleSwitch
                          enabled={settings.email.achievements}
                          onChange={(enabled) => setSettings(prev => ({
                            ...prev!,
                            email: { ...prev!.email, achievements: enabled }
                          }))}
                          label="Achievement Celebrations"
                        />
                      </div>
                    </SettingsSection>

                    {/* Quiet Hours */}
                    <SettingsSection title="Quiet Hours" icon={Clock}>
                      <div className="space-y-4">
                        <ToggleSwitch
                          enabled={settings.schedule.quietHours.enabled}
                          onChange={(enabled) => setSettings(prev => ({
                            ...prev!,
                            schedule: {
                              ...prev!.schedule,
                              quietHours: { ...prev!.schedule.quietHours, enabled }
                            }
                          }))}
                          label="Enable Quiet Hours"
                          description="Pause notifications during specified hours"
                        />
                        
                        {settings.schedule.quietHours.enabled && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                              </label>
                              <input
                                type="time"
                                value={settings.schedule.quietHours.start}
                                onChange={(e) => setSettings(prev => ({
                                  ...prev!,
                                  schedule: {
                                    ...prev!.schedule,
                                    quietHours: { ...prev!.schedule.quietHours, start: e.target.value }
                                  }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time
                              </label>
                              <input
                                type="time"
                                value={settings.schedule.quietHours.end}
                                onChange={(e) => setSettings(prev => ({
                                  ...prev!,
                                  schedule: {
                                    ...prev!.schedule,
                                    quietHours: { ...prev!.schedule.quietHours, end: e.target.value }
                                  }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </SettingsSection>

                    {/* Test Notification */}
                    {permission === 'granted' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-800 font-medium">
                              Notifications Enabled
                            </p>
                            <p className="text-sm text-green-600">
                              You'll receive notifications when important events happen
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={sendTestNotification}>
                            Test
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};