import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
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

    // Get lesson details with subject and user progress
    const { data: lesson, error: lessonError } = await supabaseAdmin
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
        subject:subjects(
          id,
          name,
          description,
          color
        ),
        user_progress!left(
          user_id,
          is_completed,
          score,
          xp_earned,
          completed_at,
          time_spent_seconds
        )
      `)
      .eq('id', lessonId)
      .eq('is_active', true)
      .eq('user_progress.user_id', userId)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if user has access to this lesson (basic prerequisite check)
    // In a more advanced system, you might check if previous lessons are completed
    const userProgress = lesson.user_progress?.[0];

    const response = {
      id: lesson.id,
      subject_id: lesson.subject_id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      order_index: lesson.order_index,
      xp_reward: lesson.xp_reward,
      is_active: lesson.is_active,
      created_at: lesson.created_at,
      updated_at: lesson.updated_at,
      subject: lesson.subject,
      user_progress: userProgress ? {
        completed: userProgress.is_completed,
        score: userProgress.score,
        xp_earned: userProgress.xp_earned,
        completed_at: userProgress.completed_at,
        time_spent: userProgress.time_spent_seconds
      } : null
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Lesson API error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}