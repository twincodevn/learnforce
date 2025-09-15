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

    // Fetch all active subjects with user progress
    const { data: subjects, error: subjectsError } = await supabaseAdmin
      .from('subjects')
      .select(`
        id,
        name,
        description,
        icon,
        color,
        order_index,
        is_active,
        lessons!inner(
          id,
          title,
          order_index
        ),
        user_progress!left(
          user_id,
          is_completed
        )
      `)
      .eq('is_active', true)
      .eq('lessons.is_active', true)
      .eq('user_progress.user_id', userId)
      .order('order_index');

    if (subjectsError) {
      throw subjectsError;
    }

    // Format the response with progress calculations
    const formattedSubjects = subjects?.map(subject => {
      const totalLessons = subject.lessons.length;
      const completedLessons = subject.user_progress?.filter(p => p.is_completed).length || 0;
      
      return {
        id: subject.id,
        name: subject.name,
        description: subject.description,
        icon: subject.icon || '📚',
        color: subject.color || 'blue',
        totalLessons,
        completedLessons,
        progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        order: subject.order_index
      };
    }) || [];

    return NextResponse.json(formattedSubjects);

  } catch (error) {
    console.error('Subjects API error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}