'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { LeaderboardSystem } from "@/components/features/leaderboard/LeaderboardSystem";

export default function LeaderboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-1">
            See how you rank against other learners worldwide
          </p>
        </div>
        <LeaderboardSystem />
      </div>
    </DashboardLayout>
  );
}