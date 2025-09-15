import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user details with stats
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        email,
        username,
        full_name,
        avatar_url,
        xp,
        level,
        current_streak,
        longest_streak,
        total_lessons_completed,
        total_time_spent,
        created_at,
        last_active_at
      `)
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate user's current rank
    const { data: rankData } = await supabaseAdmin
      .from('users')
      .select('id')
      .gt('xp', user.xp)
      .order('xp', { ascending: false });
    
    const currentRank = (rankData?.length || 0) + 1;

    // Get total user count for percentage calculation
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Fetch user's recent activity
    const { data: recentProgress } = await supabaseAdmin
      .from('user_progress')
      .select(`
        id,
        lesson_id,
        xp_earned,
        completed_at,
        lesson:lessons(title, xp_reward),
        subject:subjects(name)
      `)
      .eq('user_id', userId)
      .eq('is_completed', true)
      .order('completed_at', { ascending: false })
      .limit(10);

    // Fetch user's recent achievements
    const { data: recentAchievements } = await supabaseAdmin
      .from('user_achievements')
      .select(`
        id,
        unlocked_at,
        achievement:achievements(
          id,
          name,
          description,
          icon,
          category,
          xp_reward
        )
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })
      .limit(5);

    // Get daily goals progress
    const { data: dailyGoals } = await supabaseAdmin
      .from('daily_goals')
      .select('*')
      .eq('user_id', userId)
      .gte('date', new Date().toISOString().split('T')[0])
      .single();

    // Calculate weekly and monthly XP
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const { data: weeklyProgress } = await supabaseAdmin
      .from('user_progress')
      .select('xp_earned')
      .eq('user_id', userId)
      .gte('completed_at', weekStart.toISOString());

    const { data: monthlyProgress } = await supabaseAdmin
      .from('user_progress')
      .select('xp_earned')
      .eq('user_id', userId)
      .gte('completed_at', monthStart.toISOString());

    const weeklyXP = weeklyProgress?.reduce((sum, p) => sum + (p.xp_earned || 0), 0) || 0;
    const monthlyXP = monthlyProgress?.reduce((sum, p) => sum + (p.xp_earned || 0), 0) || 0;

    // Get current learning progress
    const { data: currentLesson } = await supabaseAdmin
      .from('user_progress')
      .select(`
        lesson:lessons(
          id,
          title,
          description,
          xp_reward,
          subject:subjects(id, name)
        )
      `)
      .eq('user_id', userId)
      .eq('is_completed', false)
      .order('created_at', { ascending: false })
      .limit(1);

    // Friends activity (if social features are implemented)
    const { data: friendsActivity } = await supabaseAdmin
      .from('user_progress')
      .select(`
        xp_earned,
        completed_at,
        user:users(username, full_name, avatar_url),
        lesson:lessons(title)
      `)
      .neq('user_id', userId)
      .eq('is_completed', true)
      .order('completed_at', { ascending: false })
      .limit(10);

    // Format response data
    const dashboardData = {
      user: {
        name: user.full_name || user.username,
        username: user.username,
        level: user.level || 1,
        xp: user.xp || 0,
        streak: user.current_streak || 0,
        avatar: user.avatar_url,
      },
      stats: {
        totalLessons: user.total_lessons_completed || 0,
        timeSpent: Math.round((user.total_time_spent || 0) / 60), // Convert to hours
        weeklyXP,
        monthlyXP,
        rank: currentRank,
        totalUsers: totalUsers || 0,
      },
      recentActivity: recentProgress?.map(progress => ({
        id: progress.id,
        type: 'lesson' as const,
        title: `Completed ${progress.lesson?.title || 'Unknown Lesson'}`,
        description: `You earned ${progress.xp_earned} XP!`,
        timestamp: formatTimeAgo(progress.completed_at),
        xp: progress.xp_earned,
      })) || [],
      recentAchievements: recentAchievements?.map(ua => ({
        id: ua.id,
        title: ua.achievement?.name || 'Unknown Achievement',
        description: ua.achievement?.description || '',
        icon: ua.achievement?.icon || 'trophy',
        unlockedAt: ua.unlocked_at,
      })) || [],
      dailyGoals: [
        {
          id: 'lessons',
          title: 'Complete 3 lessons',
          completed: (dailyGoals?.lessons_completed || 0) >= (dailyGoals?.lessons_goal || 3),
          xp: 15,
          progress: Math.min(100, ((dailyGoals?.lessons_completed || 0) / (dailyGoals?.lessons_goal || 3)) * 100),
        },
        {
          id: 'xp',
          title: `Earn ${dailyGoals?.xp_goal || 50} XP`,
          completed: (dailyGoals?.xp_earned || 0) >= (dailyGoals?.xp_goal || 50),
          xp: 20,
          progress: Math.min(100, ((dailyGoals?.xp_earned || 0) / (dailyGoals?.xp_goal || 50)) * 100),
        },
        {
          id: 'time',
          title: `Study for ${dailyGoals?.time_goal || 30} minutes`,
          completed: (dailyGoals?.time_spent || 0) >= (dailyGoals?.time_goal || 30),
          xp: 10,
          progress: Math.min(100, ((dailyGoals?.time_spent || 0) / (dailyGoals?.time_goal || 30)) * 100),
        },
      ],
      friendsActivity: friendsActivity?.map(activity => ({
        id: activity.user?.username || 'unknown',
        name: activity.user?.full_name || activity.user?.username || 'Unknown User',
        username: activity.user?.username || 'unknown',
        avatar: activity.user?.avatar_url,
        action: `completed "${activity.lesson?.title}"`,
        timestamp: formatTimeAgo(activity.completed_at),
        xp: activity.xp_earned,
      })) || [],
      continueLearning: currentLesson?.[0]?.lesson ? {
        subjectId: currentLesson[0].lesson.subject?.id,
        subjectName: currentLesson[0].lesson.subject?.name,
        lessonId: currentLesson[0].lesson.id,
        lessonTitle: currentLesson[0].lesson.title,
        progress: 0, // Will be calculated based on user progress
        difficulty: 'intermediate' as const,
      } : null,
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}