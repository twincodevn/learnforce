import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "weekly";
    const limit = parseInt(searchParams.get("limit") || "10");

    let dateFilter: Date | undefined;

    switch (period) {
      case "daily":
        dateFilter = new Date();
        dateFilter.setHours(0, 0, 0, 0);
        break;
      case "weekly":
        dateFilter = new Date();
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case "monthly":
        dateFilter = new Date();
        dateFilter.setMonth(dateFilter.getMonth() - 1);
        break;
      case "all_time":
        dateFilter = undefined;
        break;
    }

    // Get leaderboard data
    const { data: leaderboard, error } = await supabaseAdmin
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
      .gte('last_active_at', dateFilter?.toISOString() || '1900-01-01')
      .order('xp', { ascending: false })
      .order('level', { ascending: false })
      .order('current_streak', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Add rank to each user and format the response
    const leaderboardWithRank = leaderboard?.map((user: any, index: number) => ({
      id: user.id,
      userId: user.id,
      xp: user.xp,
      level: user.level,
      streak: user.current_streak,
      rank: index + 1,
      period,
      createdAt: user.last_active_at || new Date(),
      updatedAt: user.last_active_at || new Date(),
      user: {
        username: user.username,
        name: user.full_name,
        image: user.avatar_url,
      },
    })) || [];

    return NextResponse.json({
      period,
      leaderboard: leaderboardWithRank,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
