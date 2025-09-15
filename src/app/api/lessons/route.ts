import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');

    // Build query
    let query = supabaseAdmin
      .from('lessons')
      .select(`
        id,
        subject_id,
        title,
        description,
        content,
        order_index,
        xp_reward,
        is_active,
        created_at,
        updated_at,
        subject:subjects(name, color),
        user_progress!left(
          user_id,
          is_completed,
          score,
          xp_earned,
          completed_at
        )
      `)
      .eq('is_active', true)
      .eq('user_progress.user_id', userId)
      .order('order_index');

    if (subjectId) {
      query = query.eq('subject_id', subjectId);
    }

    const { data: lessons, error: lessonsError } = await query;

    if (lessonsError) {
      throw lessonsError;
    }

    // Format lessons with progress information
    const formattedLessons = lessons?.map(lesson => {
      const userProgress = lesson.user_progress?.[0];
      
      return {
        id: lesson.id,
        subjectId: lesson.subject_id,
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        order: lesson.order_index,
        xpReward: lesson.xp_reward,
        isActive: lesson.is_active,
        createdAt: lesson.created_at,
        updatedAt: lesson.updated_at,
        subject: lesson.subject,
        progress: userProgress ? {
          completed: userProgress.is_completed,
          score: userProgress.score,
          xpEarned: userProgress.xp_earned,
          completedAt: userProgress.completed_at
        } : null
      };
    }) || [];

    return NextResponse.json(formattedLessons);

  } catch (error) {
    console.error('Lessons API error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}