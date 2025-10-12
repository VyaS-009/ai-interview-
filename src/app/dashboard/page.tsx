"use client";

import CandidateTable from "@/components/dashboard/CandidateTable";
import withAuth from "@/components/auth/withAuth";

function DashboardPage() {
  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/50 shadow-2xl shadow-purple-500/10 p-8 m-4">
      <CandidateTable />
    </div>
  );
}

export default withAuth(DashboardPage);
