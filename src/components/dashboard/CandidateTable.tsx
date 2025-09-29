// src/components/dashboard/CandidateTable.tsx
"use client";

import { Table, Input, Button } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import CandidateModal from "./CandidateModal";

const { Search } = Input;

const CandidateTable: React.FC = () => {
  const candidates =
    useSelector((state: RootState) => state.interview.candidates) || []; // Safeguard with empty array
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Score",
      dataIndex: "finalScore",
      key: "finalScore",
      sorter: (a: any, b: any) => (a.finalScore || 0) - (b.finalScore || 0),
    },
    {
      title: "Completed At",
      dataIndex: "completedAt",
      key: "completedAt",
      render: (text: string) =>
        text ? new Date(text).toLocaleString() : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button onClick={() => setSelectedCandidate(record.id)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <>
      <Search
        placeholder="Search by name or email"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "16px" }}
      />
      <Table
        columns={columns}
        dataSource={filteredCandidates}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      {selectedCandidate && (
        <CandidateModal
          candidateId={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </>
  );
};

export default CandidateTable;
