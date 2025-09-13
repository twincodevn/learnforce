import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user data with progress
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        user_progress (
          *,
          subject:subjects (*),
          lesson:lessons (*)
        ),
        user_achievements (
          *,
          achievement:achievements (*)
        )
      `)
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Calculate additional stats
    const totalXp = user.xp;
    const totalLessons = user.total_lessons_completed;
    const totalTime = user.total_time_spent_minutes;
    const currentStreak = user.current_streak;

    // Get weekly and monthly XP
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const { data: weeklyProgress } = await supabaseAdmin
      .from('user_progress')
      .select('xp_earned')
      .eq('user_id', userId)
      .gte('created_at', oneWeekAgo.toISOString());

    const { data: monthlyProgress } = await supabaseAdmin
      .from('user_progress')
      .select('xp_earned')
      .eq('user_id', userId)
      .gte('created_at', oneMonthAgo.toISOString());

    const weeklyXp = weeklyProgress?.reduce((sum, p) => sum + (p.xp_earned || 0), 0) || 0;
    const monthlyXp = monthlyProgress?.reduce((sum, p) => sum + (p.xp_earned || 0), 0) || 0;

    const progressData = {
      user: {
        id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        image: user.avatar_url,
      },
      stats: {
        totalXp,
        level: user.level,
        currentStreak,
        totalLessons,
        totalTime,
        weeklyXp,
        monthlyXp,
      },
      progress: user.user_progress || [],
      achievements: user.user_achievements || [],
    };

    return NextResponse.json(progressData);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
