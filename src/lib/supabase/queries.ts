import { supabaseAdmin } from './server'

export const getUserProgress = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select(`
      *,
      user_progress (
        *,
        subject:subjects (*),
        lesson:lessons (*)
      )
    `)
    .eq('id', userId)
    .single()

  return { data, error }
}

export const getLeaderboard = async (period: string, limit: number = 10) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select(`
      id,
      username,
      full_name,
      avatar_url,
      xp,
      level,
      current_streak,
      total_lessons_completed,
      last_active_at
    `)
    .order('xp', { ascending: false })
    .order('level', { ascending: false })
    .order('current_streak', { ascending: false })
    .limit(limit)

  return { data, error }
}

export const completeLesson = async (
  userId: string,
  lessonId: string,
  score: number,
  timeSpent: number
) => {
  // Get lesson details
  const { data: lesson, error: lessonError } = await supabaseAdmin
    .from('lessons')
    .select('*, subject:subjects (*)')
    .eq('id', lessonId)
    .single()

  if (lessonError || !lesson) {
    throw new Error('Lesson not found')
  }

  // Calculate XP
  const baseXp = Math.floor(lesson.xp_reward * (score / 100))
  const totalXpEarned = baseXp

  // Update user progress
  const { error: progressError } = await supabaseAdmin
    .from('user_progress')
    .upsert({
      user_id: userId,
      subject_id: lesson.subject_id,
      lesson_id: lessonId,
      is_completed: true,
      score,
      time_spent_seconds: timeSpent,
      xp_earned: totalXpEarned,
      completed_at: new Date().toISOString(),
    })

  if (progressError) {
    throw progressError
  }

  // Update user stats
  const { error: userError } = await supabaseAdmin
    .from('users')
    .update({
      xp: supabaseAdmin.raw('xp + ?', [totalXpEarned]),
      total_lessons_completed: supabaseAdmin.raw('total_lessons_completed + 1'),
      total_time_spent_minutes: supabaseAdmin.raw('total_time_spent_minutes + ?', [Math.floor(timeSpent / 60)]),
      last_active_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (userError) {
    throw userError
  }

  return { xpEarned: totalXpEarned }
}

export const getSubjects = async () => {
  const { data, error } = await supabaseAdmin
    .from('subjects')
    .select('*')
    .eq('is_active', true)
    .order('order_index')

  return { data, error }
}

export const getLessons = async (subjectId?: string) => {
  let query = supabaseAdmin
    .from('lessons')
    .select('*')
    .eq('is_active', true)
    .order('order_index')

  if (subjectId) {
    query = query.eq('subject_id', subjectId)
  }

  const { data, error } = await query

  return { data, error }
}

export const getAchievements = async () => {
  const { data, error } = await supabaseAdmin
    .from('achievements')
    .select('*')
    .eq('is_active', true)
    .order('order_index')

  return { data, error }
}

export const getUserAchievements = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('user_achievements')
    .select(`
      *,
      achievement:achievements (*)
    `)
    .eq('user_id', userId)

  return { data, error }
}
