'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UserProfile } from "./components/UserProfile";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings and view your learning progress
          </p>
        </div>
        <UserProfile />
      </div>
    </DashboardLayout>
  );
}