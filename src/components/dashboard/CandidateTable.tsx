// src/components/dashboard/CandidateTable.tsx
"use client";

import { Table, Input } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import CandidateModal from "./CandidateModal";
import { MagnifyingGlassIcon, EyeIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const { Search } = Input;

const CandidateTable: React.FC = () => {
  const candidates =
    useSelector((state: RootState) => state.interview.candidates) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: <span className="font-semibold text-gray-700">Name</span>,
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => (a.name || "").localeCompare(b.name || ""),
      render: (text: string) => <span className="font-medium text-gray-900">{text || "N/A"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Email</span>,
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="text-gray-600">{text || "N/A"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Score</span>,
      dataIndex: "finalScore",
      key: "finalScore",
      sorter: (a: any, b: any) => (a.finalScore || 0) - (b.finalScore || 0),
      render: (score: number) => (
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700">
          {score || "N/A"}
        </span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Completed At</span>,
      dataIndex: "completedAt",
      key: "completedAt",
      render: (text: string) => (
        <span className="text-gray-600">
          {text ? new Date(text).toLocaleString() : "N/A"}
        </span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Actions</span>,
      key: "actions",
      render: (_: any, record: any) => (
        <button
          onClick={() => setSelectedCandidate(record.id)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border-2 border-gray-200/50 text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:border-violet-300 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
        >
          <EyeIcon className="w-4 h-4" />
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/50 shadow-2xl shadow-purple-500/10 p-8">
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
              {filteredCandidates.length} {filteredCandidates.length === 1 ? "candidate" : "candidates"} found
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </div>
          <Input
            placeholder="Search by name or email..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl border-2 border-gray-200/50 hover:border-violet-300 focus:border-violet-400 bg-white/20 backdrop-blur-sm transition-all"
            allowClear
          />
        </div>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/50">
        <Table
          columns={columns}
          dataSource={filteredCandidates}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} candidates`,
            className: "px-4 py-4  "
          }}
          className="candidate-table"
          rowClassName="bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-violet-50/50 transition-colors duration-200"
        />
      </div>
      
      {selectedCandidate && (
        <CandidateModal
          candidateId={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};

export default CandidateTable;