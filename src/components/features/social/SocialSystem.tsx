'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Target,
  Zap,
  Heart,
  Send,
  Search,
  Filter,
  Settings,
  Crown,
  Star,
  Calendar,
  BookOpen,
  TrendingUp,
  Award,
  Swords,
  UserCheck,
  UserX,
  Globe,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface SocialUser {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
  isOnline: boolean;
  lastActive: Date;
  mutualFriends?: number;
  relationship: 'none' | 'following' | 'follower' | 'friend' | 'blocked';
  studyStreak?: number;
  achievements: string[];
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: SocialUser[];
  isPrivate: boolean;
  subject: string;
  weeklyGoal: number;
  currentProgress: number;
  createdBy: string;
  joinRequests?: number;
}

interface Challenge {
  id: string;
  challenger: SocialUser;
  challenged?: SocialUser;
  title: string;
  description: string;
  type: 'xp' | 'lessons' | 'streak' | 'time';
  target: number;
  timeLimit: string;
  status: 'pending' | 'active' | 'completed' | 'declined';
  progress: {
    challenger: number;
    challenged?: number;
  };
  winner?: string;
  reward: string;
  createdAt: Date;
}

interface SocialPost {
  id: string;
  user: SocialUser;
  type: 'achievement' | 'milestone' | 'challenge' | 'lesson_complete' | 'streak';
  content: string;
  data: any;
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: Date;
}

interface SocialSystemProps {
  currentUser: SocialUser;
  onFollowUser: (userId: string) => void;
  onUnfollowUser: (userId: string) => void;
  onBlockUser: (userId: string) => void;
  onChallengeUser: (userId: string, challenge: Partial<Challenge>) => void;
  onJoinGroup: (groupId: string) => void;
  onCreateGroup: (group: Partial<StudyGroup>) => void;
  onShareAchievement: (achievement: string) => void;
}

export const SocialSystem: React.FC<SocialSystemProps> = ({
  currentUser,
  onFollowUser,
  onUnfollowUser,
  onBlockUser,
  onChallengeUser,
  onJoinGroup,
  onCreateGroup,
  onShareAchievement,
}) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'discover' | 'groups' | 'challenges' | 'feed'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<SocialUser[]>([]);
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SocialUser | null>(null);

  // Mock data
  useEffect(() => {
    const mockUsers: SocialUser[] = [
      {
        id: '1',
        username: 'CodeMaster',
        name: 'Alex Johnson',
        level: 42,
        xp: 15240,
        streak: 25,
        isOnline: true,
        lastActive: new Date(),
        relationship: 'friend',
        mutualFriends: 5,
        studyStreak: 12,
        achievements: ['Speed Demon', '100 Lessons', 'Streak Master'],
      },
      {
        id: '2',
        username: 'ReactNinja',
        name: 'Sarah Chen',
        level: 38,
        xp: 12850,
        streak: 18,
        isOnline: false,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        relationship: 'following',
        achievements: ['React Expert', 'Component Master'],
      },
    ];

    const mockGroups: StudyGroup[] = [
      {
        id: '1',
        name: 'JavaScript Masters',
        description: 'Advanced JavaScript concepts and best practices',
        members: mockUsers.slice(0, 3),
        isPrivate: false,
        subject: 'JavaScript',
        weeklyGoal: 500,
        currentProgress: 320,
        createdBy: '1',
        joinRequests: 2,
      },
      {
        id: '2',
        name: 'React Study Group',
        description: 'Learning React together, one component at a time',
        members: mockUsers.slice(0, 2),
        isPrivate: true,
        subject: 'React',
        weeklyGoal: 300,
        currentProgress: 180,
        createdBy: '2',
      },
    ];

    const mockChallenges: Challenge[] = [
      {
        id: '1',
        challenger: mockUsers[0],
        challenged: currentUser,
        title: 'XP Sprint',
        description: 'First to 100 XP wins!',
        type: 'xp',
        target: 100,
        timeLimit: '24 hours',
        status: 'active',
        progress: { challenger: 65, challenged: 42 },
        reward: 'Winner Badge',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    ];

    const mockPosts: SocialPost[] = [
      {
        id: '1',
        user: mockUsers[0],
        type: 'achievement',
        content: 'Just earned the Speed Demon achievement! 🚀',
        data: { achievement: 'Speed Demon', xp: 50 },
        likes: 12,
        comments: 3,
        isLiked: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: '2',
        user: mockUsers[1],
        type: 'streak',
        content: 'Hit day 18 of my learning streak! 🔥',
        data: { streak: 18 },
        likes: 8,
        comments: 2,
        isLiked: true,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    ];

    setUsers(mockUsers);
    setGroups(mockGroups);
    setChallenges(mockChallenges);
    setPosts(mockPosts);
  }, []);

  const UserCard: React.FC<{ user: SocialUser; showActions?: boolean }> = ({ user, showActions = true }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{user.username}</h3>
              {user.relationship === 'friend' && (
                <div className="w-2 h-2 bg-green-500 rounded-full" title="Friend" />
              )}
            </div>
            <p className="text-sm text-gray-600">{user.name}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
              <span>Level {user.level}</span>
              <span>{user.xp.toLocaleString()} XP</span>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-orange-500" />
                <span>{user.streak} day streak</span>
              </div>
            </div>
          </div>
        </div>

        {showActions && user.id !== currentUser.id && (
          <div className="flex items-center space-x-2">
            <Button
              variant={user.relationship === 'following' ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => 
                user.relationship === 'following' 
                  ? onUnfollowUser(user.id) 
                  : onFollowUser(user.id)
              }
            >
              {user.relationship === 'following' ? (
                <UserCheck className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedUser(user);
                setShowChallengeModal(true);
              }}
            >
              <Swords className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Achievements */}
      {user.achievements.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {user.achievements.slice(0, 3).map((achievement) => (
            <span
              key={achievement}
              className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
            >
              {achievement}
            </span>
          ))}
          {user.achievements.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{user.achievements.length - 3} more
            </span>
          )}
        </div>
      )}
    </motion.div>
  );

  const GroupCard: React.FC<{ group: StudyGroup }> = ({ group }) => {
    const progressPercentage = (group.currentProgress / group.weeklyGoal) * 100;
    const isMember = group.members.some(member => member.id === currentUser.id);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900">{group.name}</h3>
              {group.isPrivate && (
                <Lock className="w-4 h-4 text-gray-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{group.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{group.members.length} members</span>
              <span>Subject: {group.subject}</span>
              {group.joinRequests && group.joinRequests > 0 && (
                <span>{group.joinRequests} pending requests</span>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Weekly Goal Progress</span>
            <span>{group.currentProgress}/{group.weeklyGoal} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 text-right">
            {Math.round(progressPercentage)}% complete
          </div>
        </div>

        {/* Members */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {group.members.slice(0, 4).map((member) => (
              <div
                key={member.id}
                className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {group.members.length > 4 && (
              <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs font-bold">
                +{group.members.length - 4}
              </div>
            )}
          </div>

          <Button
            variant={isMember ? 'outline' : 'primary'}
            size="sm"
            onClick={() => onJoinGroup(group.id)}
          >
            {isMember ? 'View Group' : 'Join Group'}
          </Button>
        </div>
      </motion.div>
    );
  };

  const PostCard: React.FC<{ post: SocialPost }> = ({ post }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {post.user.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold text-gray-900">{post.user.username}</h4>
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-gray-800 mb-3">{post.content}</p>
          
          {/* Post-specific content */}
          {post.type === 'achievement' && post.data.achievement && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">{post.data.achievement}</span>
                <span className="text-sm text-yellow-600">+{post.data.xp} XP</span>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              className={cn(
                'flex items-center space-x-1 text-sm transition-colors duration-200',
                post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              )}
            >
              <Heart className={cn('w-4 h-4', post.isLiked && 'fill-current')} />
              <span>{post.likes}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors duration-200">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-500 transition-colors duration-200">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Social Learning</h1>
        <p className="text-gray-600 mt-2">Connect, compete, and learn together</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-xl">
          {(['friends', 'discover', 'groups', 'challenges', 'feed'] as const).map((tab) => (
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
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      {(activeTab === 'friends' || activeTab === 'discover') && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'friends' && (
          <motion.div
            key="friends"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {users
                .filter(user => user.relationship === 'friend' || user.relationship === 'following')
                .filter(user => 
                  searchQuery === '' || 
                  user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'discover' && (
          <motion.div
            key="discover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {users
                .filter(user => user.relationship === 'none')
                .filter(user => 
                  searchQuery === '' || 
                  user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'groups' && (
          <motion.div
            key="groups"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Study Groups</h2>
              <Button
                variant="primary"
                onClick={() => setShowCreateGroup(true)}
              >
                <Users className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'challenges' && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid gap-6">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{challenge.title}</h3>
                      <p className="text-gray-600">{challenge.description}</p>
                    </div>
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      challenge.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : challenge.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    )}>
                      {challenge.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Challenger</h4>
                      <UserCard user={challenge.challenger} showActions={false} />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {challenge.progress.challenger}
                        </div>
                        <div className="text-sm text-gray-500">/ {challenge.target} {challenge.type.toUpperCase()}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">You</h4>
                      <UserCard user={currentUser} showActions={false} />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {challenge.progress.challenged || 0}
                        </div>
                        <div className="text-sm text-gray-500">/ {challenge.target} {challenge.type.toUpperCase()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <div className="text-sm text-gray-500 mb-2">
                      Time limit: {challenge.timeLimit} | Reward: {challenge.reward}
                    </div>
                    {challenge.status === 'pending' && (
                      <div className="space-x-3">
                        <Button variant="primary" size="sm">Accept</Button>
                        <Button variant="outline" size="sm">Decline</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'feed' && (
          <motion.div
            key="feed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};