'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardOverview } from "./components/DashboardOverview";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}