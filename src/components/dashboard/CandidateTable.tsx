// src/components/dashboard/CandidateTable.tsx
"use client";

import { Input, Alert, Empty, Card, Progress, Skeleton } from "antd";
import { useState } from "react";
import { useGetInterviewHistoryQuery } from "@/lib/api/interviewApi";
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
// import { Candidate } from "@/types/interview";
import { useRouter } from "next/navigation";

interface ApiError {
  status: number;
  data: { detail: string };
}

const CandidateTable: React.FC = () => {
  const {
    data: candidates,
    isLoading,
    isError,
    error,
  } = useGetInterviewHistoryQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredCandidates = (candidates || []).filter(
    (candidate) =>
      candidate.jobRole?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  if (isLoading) {
    // Loading Skeleton
    return <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/50 shadow-2xl p-8 h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="!bg-white/20 !backdrop-blur-sm !rounded-2xl !border-white/50">
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        ))}
      </div>
    </div>;
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description={
          (error as ApiError)?.data?.detail ||
          "Failed to load interview history. Please try again later."
        }
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <ChartBarIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Candidate Dashboard
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredCandidates.length} {filteredCandidates.length === 1 ? "entry" : "entries"} found
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </div>
          <Input
            placeholder="Search by job role..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl border-2 border-gray-200/50 hover:border-violet-300 focus:border-violet-400 bg-white/20 backdrop-blur-sm transition-all"
            allowClear
          />
        </div>
      </div>

      {filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <Card
              key={candidate.id}
              hoverable
              onClick={() => router.push(`/dashboard/${candidate.id}`)}
              className="!bg-white/20 !backdrop-blur-sm !rounded-2xl !border-white/50 !shadow-lg hover:!shadow-xl hover:!scale-[1.02] transition-all duration-300"
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                      {candidate.jobRole || "General Interview"}
                    </h3>
                    <Progress type="circle" percent={candidate.finalScore || 0} size={50} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span>
                      {candidate.completedAt
                        ? new Date(candidate.completedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <span className="text-violet-600 font-semibold hover:text-violet-800">
                    View Report →
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Empty description="No interview history found." className="py-16" />
      )}

    </div>
  );
};

export default CandidateTable;