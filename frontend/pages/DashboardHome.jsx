import { Briefcase, Users, FolderOpen, UserCheck } from "lucide-react";

import { StatCard } from "../components/StatCard";
import { RecentJobsTable } from "../components/RecentJobsTable";
import { RecentCandidatesTable } from "../components/RecentCandidatesTable";
import { QuickActionsPanel } from "../components/QuickActionsPanel";

export default function DashboardHome() {

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Overview
        </h1>

        <p className="text-gray-500 mt-2">
          Track your recruitment metrics and manage candidates efficiently
        </p>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Jobs Posted"
          value={48}
          icon={Briefcase}
          trend="+12%"
          gradient="bg-gradient-to-br from-purple-600 to-purple-700"
        />

        <StatCard
          title="Total Candidates"
          value={324}
          icon={Users}
          trend="+8%"
          gradient="bg-gradient-to-br from-blue-600 to-blue-700"
        />

        <StatCard
          title="Open Vacancies"
          value={23}
          icon={FolderOpen}
          description="Currently hiring"
          gradient="bg-gradient-to-br from-emerald-600 to-emerald-700"
        />

        <StatCard
          title="Matched Candidates"
          value={187}
          icon={UserCheck}
          trend="+15%"
          gradient="bg-gradient-to-br from-orange-600 to-orange-700"
        />

      </div>



      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2 space-y-6">

          <RecentJobsTable />

          <RecentCandidatesTable />

        </div>



        <div className="xl:col-span-1">

          <QuickActionsPanel />

        </div>

      </div>

    </div>

  );

}