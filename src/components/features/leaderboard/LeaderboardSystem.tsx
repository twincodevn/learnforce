"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  Star,
  Users,
  Globe,
  Calendar,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Swords,
  UserPlus,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { getLevelColor } from "@/lib/design-system/colors";

interface LeaderboardUser {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  lessonsCompleted: number;
  rank: number;
  weeklyXp: number;
  monthlyXp: number;
  league: League;
  isFriend?: boolean;
  isFollowing?: boolean;
}

interface League {
  id: string;
  name: string;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond" | "legendary";
  color: string;
  minXp: number;
  maxXp: number;
  rewards: string[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  targetXp: number;
  timeLimit: string;
  participants: number;
  reward: string;
  status: "active" | "completed" | "upcoming";
  userProgress?: number;
}

interface LeaderboardSystemProps {
  currentUser: LeaderboardUser;
  onUserProfile: (userId: string) => void;
  onFollowUser: (userId: string) => void;
  onChallengeUser: (userId: string) => void;
  onJoinChallenge: (challengeId: string) => void;
}

type Period = "daily" | "weekly" | "monthly" | "all-time";
type View = "global" | "friends" | "league";

export const LeaderboardSystem: React.FC<LeaderboardSystemProps> = ({
  currentUser,
  onUserProfile,
  onFollowUser,
  onChallengeUser,
  onJoinChallenge,
}) => {
  const [period, setPeriod] = useState<Period>("weekly");
  const [view, setView] = useState<View>("global");
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<
    "leaderboard" | "leagues" | "challenges"
  >("leaderboard");

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockUsers: LeaderboardUser[] = [
      {
        id: "1",
        username: "CodeMaster",
        name: "Alex Johnson",
        avatar: "/avatars/alex.jpg",
        xp: 15420,
        level: 47,
        streak: 23,
        lessonsCompleted: 156,
        rank: 1,
        weeklyXp: 2840,
        monthlyXp: 8950,
        league: {
          id: "diamond",
          name: "Diamond League",
          tier: "diamond",
          color: "#8B5CF6",
          minXp: 10000,
          maxXp: 20000,
          rewards: ["Premium access", "Exclusive badges"],
        },
        isFriend: true,
      },
      {
        id: "2",
        username: "ReactNinja",
        name: "Sarah Chen",
        xp: 14850,
        level: 45,
        streak: 31,
        lessonsCompleted: 142,
        rank: 2,
        weeklyXp: 2650,
        monthlyXp: 8430,
        league: {
          id: "diamond",
          name: "Diamond League",
          tier: "diamond",
          color: "#8B5CF6",
          minXp: 10000,
          maxXp: 20000,
          rewards: ["Premium access", "Exclusive badges"],
        },
        isFriend: false,
        isFollowing: true,
      },
      {
        id: "current",
        username: currentUser.username,
        name: currentUser.name,
        xp: currentUser.xp,
        level: currentUser.level,
        streak: currentUser.streak,
        lessonsCompleted: currentUser.lessonsCompleted,
        rank: 8,
        weeklyXp: 1850,
        monthlyXp: 6200,
        league: {
          id: "gold",
          name: "Gold League",
          tier: "gold",
          color: "#F59E0B",
          minXp: 5000,
          maxXp: 10000,
          rewards: ["Gold badges", "Special themes"],
        },
      },
    ];

    const mockChallenges: Challenge[] = [
      {
        id: "1",
        title: "Weekend Warrior",
        description: "Complete 10 lessons this weekend",
        targetXp: 500,
        timeLimit: "2 days",
        participants: 1247,
        reward: "100 XP Bonus",
        status: "active",
        userProgress: 3,
      },
      {
        id: "2",
        title: "Streak Master",
        description: "Maintain a 7-day streak",
        targetXp: 0,
        timeLimit: "7 days",
        participants: 892,
        reward: "Streak Badge",
        status: "active",
        userProgress: 3,
      },
      {
        id: "3",
        title: "Lightning Round",
        description: "Earn 1000 XP in 24 hours",
        targetXp: 1000,
        timeLimit: "1 day",
        participants: 523,
        reward: "Lightning Badge",
        status: "upcoming",
      },
    ];

    setUsers(mockUsers);
    setChallenges(mockChallenges);
    setLoading(false);
  }, [currentUser]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">
            #{rank}
          </span>
        );
    }
  };

  const getLeagueBadge = (league: League) => (
    <div
      className={cn(
        "px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1",
        `bg-${
          league.tier === "gold"
            ? "yellow"
            : league.tier === "silver"
            ? "gray"
            : league.tier
        }-100 text-${
          league.tier === "gold"
            ? "yellow"
            : league.tier === "silver"
            ? "gray"
            : league.tier
        }-800`
      )}
    >
      <Shield className="w-3 h-3" />
      <span>{league.name}</span>
    </div>
  );

  const UserRow: React.FC<{
    user: LeaderboardUser;
    index: number;
    isCurrentUser: boolean;
  }> = ({ user, index, isCurrentUser }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
        isCurrentUser
          ? "bg-gradient-to-r from-green-50 to-blue-50 border-green-200 ring-2 ring-green-200"
          : "bg-white border-gray-200 hover:border-gray-300"
      )}
    >
      <div className="flex items-center space-x-4 flex-1">
        {/* Rank */}
        <div className="flex items-center justify-center w-8">
          {getRankIcon(user.rank)}
        </div>

        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {user.username}
            </h3>
            {user.isFriend && (
              <div
                className="w-2 h-2 bg-green-500 rounded-full"
                title="Friend"
              />
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Level {user.level}</span>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-orange-500" />
              <span>{user.streak} streak</span>
            </div>
          </div>
        </div>

        {/* League Badge */}
        {getLeagueBadge(user.league)}
      </div>

      {/* Stats & Actions */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div
            className="font-bold text-lg"
            style={{ color: getLevelColor(user.level) }}
          >
            {user.weeklyXp.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">XP this week</div>
        </div>

        {!isCurrentUser && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUserProfile(user.id)}
            >
              View
            </Button>

            {!user.isFriend && (
              <Button
                variant={user.isFollowing ? "secondary" : "primary"}
                size="sm"
                onClick={() => onFollowUser(user.id)}
              >
                {user.isFollowing ? (
                  <Users className="w-4 h-4" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChallengeUser(user.id)}
            >
              <Swords className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );

  const ChallengeCard: React.FC<{ challenge: Challenge }> = ({ challenge }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "p-6 rounded-xl border-2 transition-all duration-200",
        challenge.status === "active"
          ? "border-green-200 bg-green-50"
          : challenge.status === "upcoming"
          ? "border-blue-200 bg-blue-50"
          : "border-gray-200 bg-gray-50"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{challenge.title}</h3>
          <p className="text-gray-600 text-sm">{challenge.description}</p>
        </div>
        <div
          className={cn(
            "px-2 py-1 rounded-full text-xs font-semibold",
            challenge.status === "active"
              ? "bg-green-100 text-green-800"
              : challenge.status === "upcoming"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          )}
        >
          {challenge.status}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4 text-orange-500" />
              <span>{challenge.targetXp} XP</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{challenge.timeLimit}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-purple-500" />
              <span>{challenge.participants} joined</span>
            </div>
          </div>
          <div className="font-semibold text-green-600">{challenge.reward}</div>
        </div>

        {challenge.userProgress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {challenge.userProgress}/{challenge.targetXp || 10}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (challenge.userProgress / (challenge.targetXp || 10)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        <Button
          variant={challenge.status === "active" ? "primary" : "outline"}
          fullWidth
          onClick={() => onJoinChallenge(challenge.id)}
          disabled={challenge.status === "completed"}
        >
          {challenge.status === "active"
            ? "Continue Challenge"
            : challenge.status === "upcoming"
            ? "Join Challenge"
            : "Completed"}
        </Button>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600">Compete with learners around the world</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center justify-center">
        <div className="bg-gray-100 p-1 rounded-xl">
          {(["leaderboard", "leagues", "challenges"] as const).map((tab) => (
            <button
              key={tab}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize",
                selectedTab === tab
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {selectedTab === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center">
              {/* Period Filter */}
              <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                {(["daily", "weekly", "monthly", "all-time"] as const).map(
                  (p) => (
                    <button
                      key={p}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize",
                        period === p
                          ? "bg-green-500 text-white"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                      onClick={() => setPeriod(p)}
                    >
                      {p.replace("-", " ")}
                    </button>
                  )
                )}
              </div>

              {/* View Filter */}
              <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                {(
                  [
                    { key: "global", icon: Globe, label: "Global" },
                    { key: "friends", icon: Users, label: "Friends" },
                    { key: "league", icon: Shield, label: "League" },
                  ] as const
                ).map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1",
                      view === key
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={() => setView(key)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current User Highlight */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-1">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Your Position
                </h3>
                <UserRow
                  user={users.find((u) => u.id === "current") || currentUser}
                  index={0}
                  isCurrentUser={true}
                />
              </div>
            </div>

            {/* Leaderboard */}
            <div className="space-y-3">
              {users
                .filter((u) => u.id !== "current")
                .slice(0, 10)
                .map((user, index) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    index={index}
                    isCurrentUser={false}
                  />
                ))}
            </div>
          </motion.div>
        )}

        {selectedTab === "challenges" && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
