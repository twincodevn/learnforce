import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/database/prisma";
import { calculateLevel, getXpReward, getStreakBonus } from "@/lib/utils/gamification";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { lessonId, score, timeSpent, answers } = await request.json();

    if (!lessonId || score === undefined) {
      return NextResponse.json(
        { message: "Lesson ID and score are required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Get lesson details
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { subject: true },
    });

    if (!lesson) {
      return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
    }

    // Calculate XP earned
    const baseXp = getXpReward(score, lesson.xpReward);
    const streakBonus = getStreakBonus(0); // This would be calculated from user's current streak
    const totalXpEarned = baseXp + (baseXp * streakBonus);

    // Update user progress
    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_subjectId_lessonId: {
          userId,
          subjectId: lesson.subjectId,
          lessonId,
        },
      },
      update: {
        completed: true,
        score,
        timeSpent,
        xpEarned: totalXpEarned,
        completedAt: new Date(),
      },
      create: {
        userId,
        subjectId: lesson.subjectId,
        lessonId,
        completed: true,
        score,
        timeSpent,
        xpEarned: totalXpEarned,
        completedAt: new Date(),
      },
    });

    // Update user's total XP and stats
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xp: {
          increment: totalXpEarned,
        },
        totalLessons: {
          increment: 1,
        },
        totalTime: {
          increment: timeSpent ? Math.floor(timeSpent / 60) : 0, // Convert seconds to minutes
        },
        lastActiveAt: new Date(),
      },
    });

    // Calculate new level
    const newLevelData = calculateLevel(updatedUser.xp);
    const leveledUp = newLevelData.current > updatedUser.level;

    // Update user level if they leveled up
    if (leveledUp) {
      await prisma.user.update({
        where: { id: userId },
        data: { level: newLevelData.current },
      });
    }

    // Check for new achievements
    const achievements = await checkAchievements(userId, updatedUser);

    return NextResponse.json({
      success: true,
      xpEarned: totalXpEarned,
      newTotalXp: updatedUser.xp,
      leveledUp,
      newLevel: newLevelData.current,
      achievements,
    });
  } catch (error) {
    console.error("Error completing lesson:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function checkAchievements(userId: string, user: any) {
  const newAchievements = [];

  // Get all achievements
  const allAchievements = await prisma.achievement.findMany({
    where: { isActive: true },
  });

  // Get user's current achievements
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });

  const unlockedAchievementIds = new Set(
    userAchievements.map((ua) => ua.achievementId)
  );

  // Check each achievement
  for (const achievement of allAchievements) {
    if (unlockedAchievementIds.has(achievement.id)) continue;

    let shouldUnlock = false;

    switch (achievement.category) {
      case "xp":
        shouldUnlock = user.xp >= achievement.requirement;
        break;
      case "lessons":
        shouldUnlock = user.totalLessons >= achievement.requirement;
        break;
      case "time":
        shouldUnlock = user.totalTime >= achievement.requirement;
        break;
      case "streak":
        shouldUnlock = user.streak >= achievement.requirement;
        break;
    }

    if (shouldUnlock) {
      // Create user achievement
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      });

      // Add XP reward
      if (achievement.xpReward > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: {
              increment: achievement.xpReward,
            },
          },
        });
      }

      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}
