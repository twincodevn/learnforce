import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { lessonId, score, timeSpent } = await request.json();

    if (!lessonId || score === undefined || timeSpent === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Get lesson details
    const { data: lesson, error: lessonError } = await supabaseAdmin
      .from('lessons')
      .select('*, subject:subjects(*)')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
    }

    // Calculate XP earned (simplified)
    const baseXp = Math.floor(score * 10); // 10 XP per 10% score
    const totalXpEarned = baseXp;

    // Update user progress
    const { error: progressError } = await supabaseAdmin
      .from('user_progress')
      .upsert({
        user_id: userId,
        subject_id: lesson.subject_id,
        lesson_id: lessonId,
        score,
        completed_at: new Date().toISOString(),
        time_spent_minutes: Math.floor(timeSpent / 60),
        xp_earned: totalXpEarned,
      });

    if (progressError) {
      throw progressError;
    }

    // Update user stats using RPC function
    const { error: userError } = await supabaseAdmin.rpc('update_user_stats', {
      user_id: userId,
      xp_gained: totalXpEarned,
      time_spent_minutes: Math.floor(timeSpent / 60)
    });

    if (userError) {
      throw userError;
    }

    // Get updated user data
    const { data: user, error: userDataError } = await supabaseAdmin
      .from('users')
      .select('xp, level, current_streak, total_lessons_completed')
      .eq('id', userId)
      .single();

    if (userDataError) {
      throw userDataError;
    }

    return NextResponse.json({
      success: true,
      xpEarned: totalXpEarned,
      userStats: {
        xp: user.xp,
        level: user.level,
        streak: user.current_streak,
        totalLessons: user.total_lessons_completed,
      },
    });
  } catch (error) {
    console.error("Error completing lesson:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}