import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/server";

interface CompletionData {
  score: number;
  timeSpent: number; // in seconds
  answers: Record<string, any>;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { lessonId } = params;
    const { score, timeSpent, answers }: CompletionData = await request.json();

    // Validate input
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }

    if (typeof timeSpent !== 'number' || timeSpent < 0) {
      return NextResponse.json({ error: "Invalid time spent" }, { status: 400 });
    }

    // Get lesson details
    const { data: lesson, error: lessonError } = await supabaseAdmin
      .from('lessons')
      .select(`
        *,
        subject:subjects(*)
      `)
      .eq('id', lessonId)
      .eq('is_active', true)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Calculate XP earned based on score
    const baseXP = lesson.xp_reward;
    const xpMultiplier = score >= 90 ? 1.2 : score >= 80 ? 1.1 : score >= 70 ? 1.0 : 0.8;
    const xpEarned = Math.floor(baseXP * xpMultiplier);

    // Check if user has already completed this lesson
    const { data: existingProgress } = await supabaseAdmin
      .from('user_progress')
      .select('id, is_completed, score, xp_earned')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();

    let progressData;
    const now = new Date().toISOString();

    if (existingProgress) {
      // Update existing progress
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('user_progress')
        .update({
          is_completed: true,
          score: Math.max(existingProgress.score || 0, score), // Keep best score
          xp_earned: existingProgress.is_completed ? existingProgress.xp_earned : xpEarned,
          time_spent_seconds: timeSpent,
          answers: JSON.stringify(answers),
          completed_at: existingProgress.is_completed ? existingProgress.completed_at : now,
          updated_at: now
        })
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }
      progressData = updated;
    } else {
      // Create new progress record
      const { data: created, error: createError } = await supabaseAdmin
        .from('user_progress')
        .insert({
          user_id: userId,
          subject_id: lesson.subject_id,
          lesson_id: lessonId,
          is_completed: true,
          score,
          xp_earned: xpEarned,
          time_spent_seconds: timeSpent,
          answers: JSON.stringify(answers),
          completed_at: now,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }
      progressData = created;
    }

    // Update user stats only if this is a new completion
    if (!existingProgress?.is_completed) {
      // Use database function to atomically update user stats
      const { error: statsError } = await supabaseAdmin.rpc('update_user_stats_on_lesson_completion', {
        p_user_id: userId,
        p_xp_gained: xpEarned,
        p_time_spent_seconds: timeSpent
      });

      if (statsError) {
        console.error('Error updating user stats:', statsError);
        // Don't throw here as the lesson completion was successful
      }

      // Update daily goals
      const today = new Date().toISOString().split('T')[0];
      const { error: goalError } = await supabaseAdmin
        .from('daily_goals')
        .upsert({
          user_id: userId,
          date: today,
          lessons_completed: 1,
          xp_earned: xpEarned,
          time_spent: Math.ceil(timeSpent / 60),
          updated_at: now
        }, {
          onConflict: 'user_id,date'
        });

      if (goalError) {
        console.error('Error updating daily goals:', goalError);
      }

      // Check for achievements
      await checkAndUnlockAchievements(userId);
    }

    // Get updated user stats
    const { data: userStats } = await supabaseAdmin
      .from('users')
      .select('xp, level, current_streak, total_lessons_completed')
      .eq('id', userId)
      .single();

    return NextResponse.json({
      success: true,
      progress: progressData,
      xpEarned: existingProgress?.is_completed ? 0 : xpEarned,
      newCompletion: !existingProgress?.is_completed,
      userStats: userStats || null
    });

  } catch (error) {
    console.error('Lesson completion error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function checkAndUnlockAchievements(userId: string) {
  try {
    // Get user stats
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('xp, current_streak, total_lessons_completed')
      .eq('id', userId)
      .single();

    if (!user) return;

    // Get available achievements that user hasn't unlocked yet
    const { data: achievements } = await supabaseAdmin
      .from('achievements')
      .select('id, category, requirement, xp_reward')
      .eq('is_active', true)
      .not('id', 'in', `(
        SELECT achievement_id 
        FROM user_achievements 
        WHERE user_id = '${userId}'
      )`);

    if (!achievements) return;

    const achievementsToUnlock = [];

    for (const achievement of achievements) {
      let shouldUnlock = false;

      switch (achievement.category) {
        case 'lessons':
          shouldUnlock = user.total_lessons_completed >= achievement.requirement;
          break;
        case 'xp':
          shouldUnlock = user.xp >= achievement.requirement;
          break;
        case 'streak':
          shouldUnlock = user.current_streak >= achievement.requirement;
          break;
      }

      if (shouldUnlock) {
        achievementsToUnlock.push({
          user_id: userId,
          achievement_id: achievement.id,
          unlocked_at: new Date().toISOString()
        });
      }
    }

    // Unlock achievements
    if (achievementsToUnlock.length > 0) {
      const { error } = await supabaseAdmin
        .from('user_achievements')
        .insert(achievementsToUnlock);

      if (error) {
        console.error('Error unlocking achievements:', error);
      }
    }

  } catch (error) {
    console.error('Error checking achievements:', error);
  }
}